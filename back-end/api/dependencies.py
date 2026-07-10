from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import SECRET_KEY, ALGORITHM
from models.user import User
from models.session import UserSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_session(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        sid = payload.get("sid")

        if sid is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    session = db.query(UserSession).filter(
        UserSession.id == sid,
    ).first()

    if session is None or session.revoked_at is not None:
        raise credentials_exception

    session.last_seen_at = datetime.now(timezone.utc)
    db.commit()

    return session


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email: str = payload.get("sub")
        sid = payload.get("sid")

        if email is None or sid is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    session = db.query(UserSession).filter(
        UserSession.id == sid,
    ).first()

    if session is None or session.revoked_at is not None:
        raise credentials_exception

    user = db.query(User).filter(
        User.email == email,
    ).first()

    if user is None:
        raise credentials_exception

    if session.user_id != user.id:
        raise credentials_exception

    session.last_seen_at = datetime.now(timezone.utc)
    db.commit()

    return user