from datetime import datetime
from typing import List, Optional

from api.dependencies import get_current_session, get_current_user
from core.database import get_db
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Path,
    Query,
    status,
)
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
from services.email_service import send_support_report_email
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


@router.post(
    "/", response_model=SupportReportResponse, status_code=status.HTTP_201_CREATED
)
async def create_support_report(
    report_data: SupportReportCreate,
    background_tasks: BackgroundTasks,
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

    background_tasks.add_task(
        send_support_report_email,
        report_id=new_report.id,
        user_name=current_user.full_name,
        user_email=current_user.email,
        category=str(new_report.category),
        subject=new_report.subject,
        description=new_report.description,
        steps_to_reproduce=new_report.steps_to_reproduce,
        include_technical_info=new_report.include_technical_info,
        app_version=new_report.app_version,
        platform=new_report.platform,
        os_version=new_report.os_version,
        device_model=new_report.device_model,
        report_status=str(new_report.status),
        created_at=str(new_report.created_at),
    )

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
