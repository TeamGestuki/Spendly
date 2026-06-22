from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.storage import save_avatar, delete_avatar, MAX_FILE_SIZE
from core.security import verify_password, get_password_hash
from models.user import User
from schemas.user import UserResponse, PasswordChange, MessageResponse
from api.dependencies import get_current_user

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
