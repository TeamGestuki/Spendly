from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

# Configuración JWT (En el futuro, la SECRET_KEY debería ir oculta en un archivo .env)
SECRET_KEY = "spendly_uTn_2026_jwt_9XfK28@LmP7Qa#Zx91vRt"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 14 # El token durará 2 semanas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    """Genera un token JWT con una fecha de expiración."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt