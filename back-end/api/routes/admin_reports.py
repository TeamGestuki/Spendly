import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Path, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from api.dependencies import get_current_admin
from core.database import get_db
from models.user import User
from models.support_report import SupportReport
from models.admin_activity_log import AdminActivityLog
from schemas.admin import (
    AdminReportResponse,
    AdminReportListResponse,
    AdminReportStatusUpdate,
    AdminReportReplyRequest,
    AdminReportReplyResponse,
    AdminUserInfo,
)
from services.email_service import send_admin_reply_email

router = APIRouter()
logger = logging.getLogger(__name__)


def _report_to_response(report: SupportReport, db: Session) -> AdminReportResponse:
    user = db.query(User).filter(User.id == report.user_id).first()
    return AdminReportResponse(
        id=report.id,
        category=report.category,
        subject=report.subject,
        description=report.description,
        status=report.status,
        created_at=report.created_at,
        user=AdminUserInfo(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
        ) if user else AdminUserInfo(id=0, full_name="Eliminado", email=""),
        admin_response=report.admin_response,
        responded_at=report.responded_at,
    )


@router.get("/reports", response_model=AdminReportListResponse)
def list_reports(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None, max_length=150),
    report_status: str = Query(None, alias="status"),
    category: str = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(SupportReport)

    if search:
        pattern = f"%{search}%"
        query = query.join(User, SupportReport.user_id == User.id).filter(
            or_(
                SupportReport.subject.ilike(pattern),
                User.email.ilike(pattern),
                User.full_name.ilike(pattern),
            )
        )

    if report_status:
        query = query.filter(SupportReport.status == report_status)

    if category:
        query = query.filter(SupportReport.category == category)

    status_order = {
        "open": 0,
        "in_review": 1,
        "resolved": 2,
        "closed": 3,
    }

    total = query.count()

    reports = query.all()
    reports.sort(
        key=lambda r: (
            status_order.get(r.status, 99),
            -(r.created_at.timestamp() if r.created_at else 0),
        )
    )

    pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    page_reports = reports[start : start + page_size]

    return AdminReportListResponse(
        items=[_report_to_response(r, db) for r in page_reports],
        page=page,
        page_size=page_size,
        total=total,
        pages=pages,
    )


@router.get("/reports/{report_id}", response_model=AdminReportResponse)
def get_report(
    report_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    report = db.query(SupportReport).filter(SupportReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado",
        )
    return _report_to_response(report, db)


@router.patch("/reports/{report_id}/status", response_model=AdminReportResponse)
def update_report_status(
    body: AdminReportStatusUpdate,
    report_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    report = db.query(SupportReport).filter(SupportReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado",
        )

    old_status = report.status
    report.status = body.status

    if body.status == "resolved" and not report.resolved_at:
        report.resolved_at = datetime.now(timezone.utc)

    log = AdminActivityLog(
        admin_id=admin.id,
        action="report_status_changed",
        target_type="report",
        target_id=report.id,
        details=json.dumps({"old_status": old_status, "new_status": body.status}),
    )
    db.add(log)

    db.commit()
    db.refresh(report)

    return _report_to_response(report, db)


@router.post("/reports/{report_id}/reply", response_model=AdminReportReplyResponse)
def reply_to_report(
    body: AdminReportReplyRequest,
    background_tasks: BackgroundTasks,
    report_id: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    report = db.query(SupportReport).filter(SupportReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado",
        )

    report.admin_response = body.message
    report.responded_by_admin_id = admin.id
    report.responded_at = datetime.now(timezone.utc)

    if report.status not in ("resolved", "closed"):
        report.status = "resolved"
        if not report.resolved_at:
            report.resolved_at = datetime.now(timezone.utc)

    log = AdminActivityLog(
        admin_id=admin.id,
        action="report_replied",
        target_type="report",
        target_id=report.id,
    )
    db.add(log)

    db.commit()
    db.refresh(report)

    email_sent = False
    try:
        user = db.query(User).filter(User.id == report.user_id).first()
        if user:
            email_sent = send_admin_reply_email(
                to_email=user.email,
                user_name=user.full_name,
                report_subject=report.subject,
                admin_response=body.message,
                report_id=report.id,
            )
            if not email_sent:
                logger.warning(
                    "No se pudo enviar correo de respuesta al reporte %s a %s",
                    report_id,
                    user.email,
                )
    except Exception as e:
        logger.exception("Error enviando correo de respuesta al reporte %s: %r", report_id, e)

    if email_sent:
        message = "Respuesta enviada y correo entregado."
    else:
        message = "La respuesta fue guardada, pero el correo no pudo enviarse."

    return AdminReportReplyResponse(
        report=_report_to_response(report, db),
        email_sent=email_sent,
        message=message,
    )
