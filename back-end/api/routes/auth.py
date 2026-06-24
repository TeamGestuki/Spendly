from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.session import UserSession
from core.database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, Token
from core.security import get_password_hash, verify_password, create_access_token
from api.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el email ya está registrado
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya se encuentra registrado."
        )
    
    # 2. Hashear la contraseña antes de guardarla
    hashed_pwd = get_password_hash(user_data.password)
    
    # 3. Crear la instancia del modelo y guardarla en la BD
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # Recarga el objeto para obtener el ID autogenerado
    
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