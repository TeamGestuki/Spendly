import logging
import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.dependencies import get_current_admin
from core.database import get_db
from models.user import User
from models.support_report import SupportReport
from models.admin_activity_log import AdminActivityLog
from schemas.admin import (
    AdminDashboardResponse,
    AdminDashboardUsers,
    AdminDashboardReports,
    AdminDashboardSystem,
    AdminOnlineUsersResponse,
    AdminUserResponse,
    AdminActivityLogResponse,
    AdminActivityLogListResponse,
    AdminUserInfo,
)

router = APIRouter()
logger = logging.getLogger(__name__)

ONLINE_THRESHOLD_DEFAULT = 90


def _get_user_response(user: User) -> AdminUserResponse:
    now = datetime.now(timezone.utc)
    is_online = False
    if user.last_heartbeat_at:
        hb = user.last_heartbeat_at
        if hb.tzinfo is None:
            hb = hb.replace(tzinfo=timezone.utc)
        is_online = (now - hb) < timedelta(seconds=ONLINE_THRESHOLD_DEFAULT)

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


@router.get("/dashboard", response_model=AdminDashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    now = datetime.now(timezone.utc)
    threshold = now - timedelta(seconds=ONLINE_THRESHOLD_DEFAULT)

    total = db.query(func.count(User.id)).scalar()
    active = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    inactive = total - active
    admins = db.query(func.count(User.id)).filter(User.role == "admin").scalar()
    online = (
        db.query(func.count(User.id))
        .filter(User.last_heartbeat_at >= threshold)
        .scalar()
    )

    report_total = db.query(func.count(SupportReport.id)).scalar()
    report_open = (
        db.query(func.count(SupportReport.id))
        .filter(SupportReport.status == "open")
        .scalar()
    )
    report_in_review = (
        db.query(func.count(SupportReport.id))
        .filter(SupportReport.status == "in_review")
        .scalar()
    )
    report_resolved = (
        db.query(func.count(SupportReport.id))
        .filter(SupportReport.status == "resolved")
        .scalar()
    )
    report_closed = (
        db.query(func.count(SupportReport.id))
        .filter(SupportReport.status == "closed")
        .scalar()
    )

    smtp_configured = bool(os.getenv("SMTP_USER")) and bool(
        os.getenv("SMTP_PASSWORD")
    )

    return AdminDashboardResponse(
        users=AdminDashboardUsers(
            total=total,
            active=active,
            inactive=inactive,
            admins=admins,
            online=online,
        ),
        reports=AdminDashboardReports(
            total=report_total,
            open=report_open,
            in_review=report_in_review,
            resolved=report_resolved,
            closed=report_closed,
        ),
        system=AdminDashboardSystem(
            email_configured=smtp_configured,
            environment=os.getenv("ENVIRONMENT", "development"),
            app_version="1.1.0",
        ),
    )


@router.get("/online-users", response_model=AdminOnlineUsersResponse)
def get_online_users(
    threshold: int = Query(ONLINE_THRESHOLD_DEFAULT, ge=30, le=300),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=threshold)

    users = (
        db.query(User)
        .filter(User.last_heartbeat_at >= cutoff)
        .order_by(User.last_heartbeat_at.desc())
        .all()
    )

    return AdminOnlineUsersResponse(
        online_count=len(users),
        threshold_seconds=threshold,
        users=[_get_user_response(u) for u in users],
    )


@router.get("/activity", response_model=AdminActivityLogListResponse)
def get_activity_log(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(AdminActivityLog).order_by(
        AdminActivityLog.created_at.desc()
    )

    total = query.count()
    pages = (total + page_size - 1) // page_size
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    result_items = []
    for log in items:
        admin_user = db.query(User).filter(User.id == log.admin_id).first()
        result_items.append(
            AdminActivityLogResponse(
                id=log.id,
                action=log.action,
                target_type=log.target_type,
                target_id=log.target_id,
                details=log.details,
                created_at=log.created_at,
                admin=AdminUserInfo(
                    id=admin_user.id,
                    full_name=admin_user.full_name,
                    email=admin_user.email,
                ) if admin_user else None,
            )
        )

    return AdminActivityLogListResponse(
        items=result_items,
        page=page,
        page_size=page_size,
        total=total,
        pages=pages,
    )
