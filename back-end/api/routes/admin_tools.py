import logging
import os
from datetime import datetime, timezone
from textwrap import dedent

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from api.dependencies import get_current_admin
from core.database import get_db
from models.user import User
from models.notification import Notification
from models.admin_activity_log import AdminActivityLog
from schemas.admin import (
    AdminNotificationCreate,
    AdminNotificationResponse,
    AdminEmailTestRequest,
    AdminEmailTestResponse,
    AdminSystemHealthResponse,
    AdminScannerHealthResponse,
)
from services.email_service import send_email

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/tools/test-notification", response_model=AdminNotificationResponse)
def test_notification(
    body: AdminNotificationCreate = AdminNotificationCreate(),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    type_messages = {
        "simple": "Notificación de prueba creada",
        "goal": "Notificación de meta de prueba creada",
        "reminder": "Notificación de recordatorio de prueba creada",
        "warning": "Notificación de advertencia de prueba creada",
    }

    titles = {
        "simple": "Notificación de prueba",
        "goal": "Meta de prueba",
        "reminder": "Recordatorio de prueba",
        "warning": "Advertencia de prueba",
    }

    messages = {
        "simple": "Esta es una notificación de prueba de Spendly.",
        "goal": "Tu meta de prueba ha sido creada exitosamente.",
        "reminder": "Este es un recordatorio de prueba.",
        "warning": "Esta es una advertencia de prueba.",
    }

    notification = Notification(
        user_id=admin.id,
        title=titles.get(body.type, "Notificación de prueba"),
        message=messages.get(body.type, "Notificación de prueba"),
        type=body.type,
    )
    db.add(notification)

    log = AdminActivityLog(
        admin_id=admin.id,
        action="test_notification_sent",
        target_type="notification",
        details=f'{{"type": "{body.type}"}}',
    )
    db.add(log)

    db.commit()
    db.refresh(notification)

    return AdminNotificationResponse(
        success=True,
        notification_id=notification.id,
        message=type_messages.get(body.type, "Notificación de prueba creada"),
    )


@router.post("/tools/test-email", response_model=AdminEmailTestResponse)
def test_email(
    body: AdminEmailTestRequest = AdminEmailTestRequest(),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    text_body = (
        f"Hola {admin.full_name}:\n\n"
        f"{body.message}\n\n"
        f"Este es un correo de prueba enviado desde el panel de administración de Spendly.\n\n"
        f"Spendly © 2026"
    )

    html_body = (
        '<!DOCTYPE html><html><body style="margin:0;padding:0;background-color:#0D0F14;'
        'font-family:Arial,sans-serif;">'
        '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">'
        '<tr><td align="center">'
        '<table width="480" cellpadding="0" cellspacing="0" style="background-color:#161A23;'
        'border:1px solid #272D3D;border-radius:12px;">'
        '<tr><td style="padding:40px 32px 24px;text-align:center;">'
        '<h1 style="margin:0 0 8px;font-size:28px;color:#4ADE80;">Spendly</h1>'
        '<p style="margin:0;font-size:14px;color:#6B7280;">Correo de prueba</p></td></tr>'
        '<tr><td style="padding:0 32px 24px;">'
        f'<p style="margin:0 0 12px;font-size:15px;color:#B0B8C8;">Hola, <strong style="color:#FFFFFF;">{admin.full_name}</strong>:</p>'
        f'<p style="margin:0 0 12px;font-size:15px;color:#B0B8C8;">{body.message}</p>'
        '<p style="margin:0;font-size:14px;color:#B0B8C8;">Este es un correo de prueba enviado desde el panel de administración.</p>'
        '</td></tr>'
        '<tr><td style="padding:16px 32px 24px;border-top:1px solid #272D3D;">'
        '<p style="margin:0;font-size:12px;color:#6B7280;text-align:center;">Spendly © 2026</p>'
        '</td></tr></table></td></tr></table></body></html>'
    )

    success = send_email(
        to_email=admin.email,
        subject=body.subject,
        text_body=text_body,
        html_body=html_body,
    )

    log = AdminActivityLog(
        admin_id=admin.id,
        action="test_email_sent",
        target_type="user",
        target_id=admin.id,
        details=f'{{"success": {str(success).lower()}}}',
    )
    db.add(log)
    db.commit()

    if success:
        return AdminEmailTestResponse(
            success=True,
            message="Correo de prueba enviado correctamente.",
        )
    else:
        return AdminEmailTestResponse(
            success=False,
            message="No se pudo enviar el correo. Verificá la configuración SMTP.",
        )


@router.get("/tools/health", response_model=AdminSystemHealthResponse)
def health_check(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    db_check = {"status": "ok", "connected": True}
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_check = {"status": "offline", "connected": False}
        logger.warning("Health check: database is offline")

    smtp_configured = bool(os.getenv("SMTP_USER")) and bool(
        os.getenv("SMTP_PASSWORD")
    )

    return AdminSystemHealthResponse(
        status="ok",
        healthy=db_check["connected"],
        database=db_check,
        email_service={"configured": smtp_configured},
        environment=os.getenv("ENVIRONMENT", "development"),
        app_version="1.1.0",
        server_time=datetime.now(timezone.utc),
    )


@router.get("/tools/scanner-health", response_model=AdminScannerHealthResponse)
def scanner_health(
    admin: User = Depends(get_current_admin),
):
    api_key = os.getenv("GOOGLE_API_KEY", "")
    return AdminScannerHealthResponse(configured=bool(api_key))
