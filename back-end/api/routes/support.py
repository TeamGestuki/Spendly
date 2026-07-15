import os
from datetime import datetime
from typing import List, Optional

from api.dependencies import get_current_session, get_current_user
from core.database import get_db
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.responses import JSONResponse
from models.session import UserSession
from models.support_report import SupportReport
from models.user import User
from schemas.support_report import (
    SupportReportCategory,
    SupportReportCreate,
    SupportReportListItem,
    SupportReportResponse,
    SupportReportStatus,
    SupportReportUpdate,
)
from sqlalchemy.orm import Session

router = APIRouter()


def get_user_email(user_id: int, db: Session):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontrado el usuario o no exite",
        )
    return usuario


SMTP_HOST = os.getenv("SMTP_HOST")
try:
    SMTP_PORT = int(os.getenv("SMTP_PORT"))
except ValueError:
    SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_support_email(report: SupportReport, user_email: str):
    """Send notification email to support team"""
    try:
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        msg = MIMEMultipart()
        msg["From"] = user_email
        msg["To"] = SMTP_USERNAME
        msg["Subject"] = f"Nuevo reporte de soporte: {report.subject}"

        email_body = f"""
        Nuevo reporte de soporte creado:

        ID: {report.id}
        Usuario: {report.user.full_name} ({report.user.email})
        Categoría: {report.category}
        Asunto: {report.subject}
        Descripción: {report.description}

        Información Técnica:
        - Plataforma: {report.platform or "N/A"}
        - OS: {report.os_version or "N/A"}
        - App: {report.app_version or "N/A"}
        - Dispositivo: {report.device_model or "N/A"}
        - Incluir info técnica: {report.include_technical_info}

        Pasos para reproducir: {report.steps_to_reproduce or "N/A"}

        Estado: {report.status}
        Creado el: {report.created_at}
        """

        msg.attach(MIMEText(email_body, "plain"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


@router.post(
    "/", response_model=SupportReportResponse, status_code=status.HTTP_201_CREATED
)
async def create_support_report(
    report_data: SupportReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new support report"""
    import logging

    logger = logging.getLogger(__name__)

    new_report = SupportReport(
        user_id=current_user.id,
        category=report_data.category,
        subject=report_data.subject,
        description=report_data.description,
        steps_to_reproduce=report_data.steps_to_reproduce,
        include_technical_info=report_data.include_technical_info,
        app_version=report_data.app_version,
        platform=report_data.platform,
        os_version=report_data.os_version,
        device_model=report_data.device_model,
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Send email notification to support team
    send_support_email(new_report, current_user.email)

    logger.info(f"¡Reporte de soporte creado: {new_report.id} - {new_report.subject}")

    return new_report


@router.get("/me", response_model=List[SupportReportListItem])
async def get_my_support_reports(
    status: Optional[SupportReportStatus] = Query(
        None, description="Filtrar por estado"
    ),
    limit: int = Query(20, ge=1, le=100, description="Límite de resultados"),
    offset: int = Query(0, ge=0, description="Desplazamiento"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get support reports for the authenticated user"""
    import logging

    logger = logging.getLogger(__name__)

    query = db.query(SupportReport).filter(SupportReport.user_id == current_user.id)

    if status:
        query = query.filter(SupportReport.status == status)

    reports = (
        query.order_by(SupportReport.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    logger.info(f"User {current_user.id} requested {len(reports)} support reports")

    return reports


@router.get("/{report_id}", response_model=SupportReportResponse)
async def get_support_report(
    report_id: int = Path(..., ge=1, description="ID del reporte"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific support report"""
    import logging

    logger = logging.getLogger(__name__)

    report = db.query(SupportReport).filter(SupportReport.id == report_id).first()

    if not report:
        logger.warning(f"Attempt to access non-existent report {report_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado",
        )

    # Check if user is the owner or an admin
    if report.user_id != current_user.id and current_user.role != "admin":
        logger.warning(
            f"User {current_user.id} attempted to access report {report_id} belonging to user {report.user_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este reporte",
        )

    logger.info(f"User {current_user.id} accessed report {report_id}")

    return report


@router.patch("/{report_id}", response_model=SupportReportResponse)
async def update_support_report(
    report_id: int = Path(..., ge=1, description="ID del reporte"),
    update_data: SupportReportUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a support report (admin only)"""
    import logging

    logger = logging.getLogger(__name__)

    # Check if current user is admin
    if current_user.role != "admin":
        logger.warning(
            f"User {current_user.id} attempted to update report {report_id} without admin privileges"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores pueden actualizar reportes",
        )

    report = db.query(SupportReport).filter(SupportReport.id == report_id).first()

    if not report:
        logger.warning(f"Attempt to update non-existent report {report_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado",
        )

    update_dict = update_data.dict(exclude_unset=True)
    if update_dict:
        for key, value in update_dict.items():
            setattr(report, key, value)

    db.commit()
    db.refresh(report)

    logger.info(f"Report {report_id} updated by user {current_user.id}")

    return report

