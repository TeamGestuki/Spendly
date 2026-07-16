import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
try:
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
except (TypeError, ValueError):
    SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", SMTP_USERNAME)

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

logger.info(
    "SMTP config host=%s port=%s user=%s password_loaded=%s",
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    bool(SMTP_PASSWORD),
)


def _load_template(filename: str) -> str:
    path = TEMPLATES_DIR / filename
    return path.read_text(encoding="utf-8")


def send_email(
    to_email: str,
    subject: str,
    text_body: str,
    html_body: str,
    reply_to: str | None = None,
) -> bool:
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning(
            "SMTP no configurado. Correo a %s no enviado.", to_email
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = SMTP_USERNAME
    msg["To"] = to_email
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        logger.info(
            "Conectando a SMTP %s:%s -> %s",
            SMTP_HOST,
            SMTP_PORT,
            to_email,
        )
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Correo enviado a %s", to_email)
        return True
    except Exception as error:
        logger.exception("Error enviando correo SMTP a %s: %r", to_email, error)
        return False


def send_password_reset_email(to_email: str, user_name: str, code: str) -> bool:
    subject = "Código para restablecer tu contraseña de Spendly"

    text_body = (
        f"Hola {user_name}:\n\n"
        f"Recibimos una solicitud para restablecer la contraseña de tu cuenta.\n\n"
        f"Tu código de verificación es: {code}\n\n"
        f"Este código vence en 10 minutos.\n\n"
        f"Si no solicitaste este cambio, ignorá este mensaje. "
        f"Tu contraseña seguirá siendo la misma.\n\n"
        f"Spendly © 2026"
    )

    html_template = _load_template("reset_password_email.html")
    html_body = html_template.replace("{user_name}", user_name).replace(
        "{code}", code
    )

    return send_email(to_email, subject, text_body, html_body)


def send_support_report_email(
    report_id: int,
    user_name: str,
    user_email: str,
    category: str,
    subject: str,
    description: str,
    steps_to_reproduce: str,
    include_technical_info: bool,
    app_version: str,
    platform: str,
    os_version: str,
    device_model: str,
    report_status: str,
    created_at: str,
) -> bool:
    email_subject = f"Nuevo reporte de soporte: {subject}"

    text_body = (
        f"Nuevo reporte de soporte creado:\n\n"
        f"ID: {report_id}\n"
        f"Usuario: {user_name} ({user_email})\n"
        f"Categoría: {category}\n"
        f"Asunto: {subject}\n"
        f"Descripción: {description}\n\n"
        f"Información Técnica:\n"
        f"- Plataforma: {platform or 'N/A'}\n"
        f"- OS: {os_version or 'N/A'}\n"
        f"- App: {app_version or 'N/A'}\n"
        f"- Dispositivo: {device_model or 'N/A'}\n\n"
        f"Pasos para reproducir: {steps_to_reproduce or 'N/A'}\n\n"
        f"Estado: {report_status}\n"
        f"Creado el: {created_at}"
    )

    html_template = _load_template("support_report_email.html")
    html_body = (
        html_template
        .replace("{report_id}", str(report_id))
        .replace("{user_name}", user_name)
        .replace("{user_email}", user_email)
        .replace("{category}", category)
        .replace("{subject}", subject)
        .replace("{description}", description)
        .replace("{steps_to_reproduce}", steps_to_reproduce or "N/A")
        .replace("{platform}", platform or "N/A")
        .replace("{os_version}", os_version or "N/A")
        .replace("{app_version}", app_version or "N/A")
        .replace("{device_model}", device_model or "N/A")
        .replace("{include_technical_info}", str(include_technical_info))
        .replace("{report_status}", report_status)
        .replace("{created_at}", created_at)
    )

    return send_email(
        SUPPORT_EMAIL,
        email_subject,
        text_body,
        html_body,
        reply_to=user_email,
    )
