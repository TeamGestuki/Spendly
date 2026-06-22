from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.storage import save_avatar, delete_avatar, MAX_FILE_SIZE
from core.security import verify_password, get_password_hash
from models.user import User
from models.session import UserSession
from schemas.user import UserResponse, PasswordChange, MessageResponse
from schemas.session import SessionResponse
from api.dependencies import get_current_user, get_current_session

router = APIRouter()

@router.post("/avatar", response_model=UserResponse)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, "La imagen supera los 5 MB.")

    try:
        url = save_avatar(contents, file.filename or "avatar.jpg")
    except ValueError as e:
        raise HTTPException(400, str(e))

    current_user.profile_image_url = url
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/avatar", response_model=UserResponse)
def delete_avatar_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    old_url = current_user.profile_image_url
    current_user.profile_image_url = None
    db.commit()
    db.refresh(current_user)
    delete_avatar(old_url)
    return current_user

@router.patch("/password", response_model=MessageResponse)
def change_password(
    body: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Contraseña actual incorrecta")
    if body.current_password == body.new_password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="La nueva contraseña debe ser diferente a la actual")
    current_user.hashed_password = get_password_hash(body.new_password)
    db.commit()
    return MessageResponse(message="Contraseña actualizada correctamente")


@router.get("/sessions", response_model=list[SessionResponse])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    current_session: UserSession = Depends(get_current_session),
):
    sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.revoked_at.is_(None),
    ).all()
    return [
        SessionResponse(
            id=s.id, device_name=s.device_name, ip_address=s.ip_address,
            user_agent=s.user_agent, created_at=s.created_at,
            last_seen_at=s.last_seen_at, is_current=(s.id == current_session.id),
        )
        for s in sessions
    ]


@router.delete("/sessions/{session_id}", response_model=MessageResponse)
def revoke_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(UserSession).filter(
        UserSession.id == session_id,
        UserSession.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Sesión no encontrada")
    session.revoked_at = datetime.now(timezone.utc)
    db.commit()
    return MessageResponse(message="Sesión cerrada correctamente")


@router.delete("/sessions", response_model=MessageResponse)
def revoke_all_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    current_session: UserSession = Depends(get_current_session),
):
    now = datetime.now(timezone.utc)
    db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.revoked_at.is_(None),
        UserSession.id != current_session.id,
    ).update({"revoked_at": now})
    db.commit()
    return MessageResponse(message="Sesiones cerradas correctamente")
