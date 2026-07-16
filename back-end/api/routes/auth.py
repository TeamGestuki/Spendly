import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.session import UserSession
from models.password_reset_code import PasswordResetCode
from models.password_reset_token import PasswordResetToken
from core.database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, Token, MessageResponse
from schemas.auth import (
    ForgotPasswordRequest,
    VerifyResetCodeRequest,
    ResetPasswordRequest,
    ResetTokenResponse,
)
from core.security import get_password_hash, verify_password, create_access_token
from api.dependencies import get_current_user
from services.email_service import send_password_reset_email

router = APIRouter()

RESET_CODE_EXPIRE_MINUTES = 10
RESET_TOKEN_EXPIRE_MINUTES = 15
MAX_CODE_ATTEMPTS = 5


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya se encuentra registrado."
        )

    hashed_pwd = get_password_hash(user_data.password)

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

class LoginForm(OAuth2PasswordRequestForm):
    def __init__(
        self,
        grant_type: str = Form(None),
        username: str = Form(),
        password: str = Form(),
        scope: str = Form(""),
        client_id: str = Form(None),
        client_secret: str = Form(None),
        device_name: str | None = Form(None),
        remember_me: bool = Form(False),
    ):
        super().__init__(
            grant_type=grant_type, username=username, password=password,
            scope=scope, client_id=client_id, client_secret=client_secret,
        )
        self.device_name = device_name
        self.remember_me = remember_me

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: LoginForm = Depends(),
    request: Request = None,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    session = UserSession(
        user_id=user.id,
        device_name=form_data.device_name,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    token_expires = timedelta(days=30 if form_data.remember_me else 7)
    access_token = create_access_token(
        data={"sub": user.email, "sid": session.id},
        expires_delta=token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


# ─── Password Recovery ──────────────────────────────────────────

def _invalidate_pending_codes(db: Session, user_id: int) -> None:
    db.query(PasswordResetCode).filter(
        PasswordResetCode.user_id == user_id,
        PasswordResetCode.used == False,
    ).update({"used": True})
    db.commit()


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    body: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    normalized_email = body.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()

    generic_message = MessageResponse(
        message="Si existe una cuenta asociada a ese correo, recibirás un código de recuperación."
    )

    if not user:
        return generic_message

    _invalidate_pending_codes(db, user.id)

    code = f"{secrets.randbelow(1_000_000):06d}"
    code_hash = get_password_hash(code)
    now = datetime.now(timezone.utc)

    reset_code = PasswordResetCode(
        user_id=user.id,
        code_hash=code_hash,
        expires_at=now + timedelta(minutes=RESET_CODE_EXPIRE_MINUTES),
        attempts=0,
        used=False,
    )
    db.add(reset_code)
    db.commit()

    background_tasks.add_task(
        send_password_reset_email,
        to_email=user.email,
        user_name=user.full_name,
        code=code,
    )

    return generic_message


@router.post("/verify-reset-code", response_model=ResetTokenResponse)
def verify_reset_code(
    body: VerifyResetCodeRequest,
    db: Session = Depends(get_db),
):
    normalized_email = body.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código ingresado es incorrecto.",
        )

    now = datetime.now(timezone.utc)

    reset_code = (
        db.query(PasswordResetCode)
        .filter(
            PasswordResetCode.user_id == user.id,
            PasswordResetCode.used == False,
            PasswordResetCode.expires_at > now,
        )
        .order_by(PasswordResetCode.id.desc())
        .first()
    )

    if not reset_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código venció. Solicitá uno nuevo.",
        )

    if reset_code.attempts >= MAX_CODE_ATTEMPTS:
        reset_code.used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Superaste la cantidad máxima de intentos. Solicitá un código nuevo.",
        )

    if not verify_password(body.code, reset_code.code_hash):
        reset_code.attempts += 1
        db.commit()
        if reset_code.attempts >= MAX_CODE_ATTEMPTS:
            reset_code.used = True
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Superaste la cantidad máxima de intentos. Solicitá un código nuevo.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código ingresado es incorrecto.",
        )

    reset_code.used = True
    reset_code.verified_at = now
    db.commit()

    raw_token = secrets.token_urlsafe(48)
    token_hash = get_password_hash(raw_token)

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=now + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES),
        used=False,
    )
    db.add(reset_token)
    db.commit()

    return ResetTokenResponse(reset_token=raw_token)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    all_tokens = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.used == False)
        .all()
    )

    matched_token = None
    for token_record in all_tokens:
        if verify_password(body.reset_token, token_record.token_hash):
            matched_token = token_record
            break

    if not matched_token or matched_token.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La solicitud de recuperación no es válida o venció.",
        )

    user = db.query(User).filter(User.id == matched_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La solicitud de recuperación no es válida o venció.",
        )

    user.hashed_password = get_password_hash(body.new_password)

    matched_token.used = True

    db.query(PasswordResetCode).filter(
        PasswordResetCode.user_id == user.id,
        PasswordResetCode.used == False,
    ).update({"used": True})

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False,
    ).update({"used": True})

    db.query(UserSession).filter(
        UserSession.user_id == user.id,
        UserSession.revoked_at.is_(None),
    ).update({"revoked_at": now})

    db.commit()

    return MessageResponse(message="La contraseña fue actualizada correctamente.")
