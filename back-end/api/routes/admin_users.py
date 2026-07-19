import json
import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.dependencies import get_current_admin
from core.database import get_db
from models.user import User
from models.admin_activity_log import AdminActivityLog
from schemas.admin import (
    AdminUserResponse,
    AdminUserListResponse,
    AdminUserStatusUpdate,
    AdminUserRoleUpdate,
    AdminUserInfo,
)

router = APIRouter()
logger = logging.getLogger(__name__)

ONLINE_THRESHOLD = 90


def _user_to_response(user: User) -> AdminUserResponse:
    now = datetime.now(timezone.utc)
    is_online = False
    if user.last_heartbeat_at:
        hb = user.last_heartbeat_at
        if hb.tzinfo is None:
            hb = hb.replace(tzinfo=timezone.utc)
        is_online = (now - hb) < timedelta(seconds=ONLINE_THRESHOLD)

    return AdminUserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        is_online=is_online,
        last_heartbeat_at=user.last_heartbeat_at,
        created_at=getattr(user, "created_at", None),
    )


def _log_activity(
    db: Session,
    admin_id: int,
    action: str,
    target_type: str,
    target_id: int,
    details: dict = None,
):
    log = AdminActivityLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=json.dumps(details) if details else None,
    )
    db.add(log)


@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None, max_length=100),
    role: str = Query(None),
    is_active: bool = Query(None),
    online: bool = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(User)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (User.full_name.ilike(pattern)) | (User.email.ilike(pattern))
        )

    if role is not None:
        query = query.filter(User.role == role)

    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    if online is not None:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(seconds=ONLINE_THRESHOLD)
        if online:
            query = query.filter(User.last_heartbeat_at >= cutoff)
        else:
            query = query.filter(
                (User.last_heartbeat_at < cutoff) | (User.last_heartbeat_at.is_(None))
            )

    total = query.count()
    pages = (total + page_size - 1) // page_size
    users = query.order_by(User.id).offset((page - 1) * page_size).limit(page_size).all()

    return AdminUserListResponse(
        items=[_user_to_response(u) for u in users],
        page=page,
        page_size=page_size,
        total=total,
        pages=pages,
    )


@router.get("/users/{user_id}", response_model=AdminUserResponse)
def get_user(
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    return _user_to_response(user)


@router.patch("/users/{user_id}/status", response_model=AdminUserResponse)
def update_user_status(
    body: AdminUserStatusUpdate,
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    if user.id == admin.id and not body.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés desactivar tu propia cuenta",
        )

    if not body.is_active:
        active_admins = (
            db.query(func.count(User.id))
            .filter(User.role == "admin", User.is_active == True, User.id != user.id)
            .scalar()
        )
        if user.role == "admin" and active_admins == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No podés desactivar al último administrador",
            )

    old_status = user.is_active
    user.is_active = body.is_active

    _log_activity(
        db,
        admin.id,
        "user_status_changed",
        "user",
        user.id,
        {"old_is_active": old_status, "new_is_active": body.is_active},
    )

    db.commit()
    db.refresh(user)

    return _user_to_response(user)


@router.patch("/users/{user_id}/role", response_model=AdminUserResponse)
def update_user_role(
    body: AdminUserRoleUpdate,
    user_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    if user.id == admin.id and body.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés quitar tu propio rol de administrador",
        )

    if body.role != "admin" and user.role == "admin":
        active_admins = (
            db.query(func.count(User.id))
            .filter(User.role == "admin", User.is_active == True, User.id != user.id)
            .scalar()
        )
        if active_admins == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No podés cambiar el rol del último administrador",
            )

    old_role = user.role
    user.role = body.role

    _log_activity(
        db,
        admin.id,
        "user_role_changed",
        "user",
        user.id,
        {"old_role": old_role, "new_role": body.role},
    )

    db.commit()
    db.refresh(user)

    return _user_to_response(user)
