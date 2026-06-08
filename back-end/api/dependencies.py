from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import SECRET_KEY, ALGORITHM
from models.user import User

# Esto le indica a FastAPI (y a Swagger) dónde está la ruta para conseguir el token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Esta función intercepta la petición, lee el token, lo decodifica y busca 
    al usuario en la base de datos. Si algo falla, bloquea el acceso (Error 401).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Intentamos decodificar el token usando nuestra clave secreta
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Buscamos al usuario en la base de datos usando el email que venía en el token
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
        
    return user