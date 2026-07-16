import json
import logging
import os
from datetime import date

from api.dependencies import get_current_user
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from google import genai
from google.genai import types
from models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    logger.warning("GOOGLE_API_KEY no está configurada.")

client = genai.Client(api_key=API_KEY) if API_KEY else None

PROMPT_INSTRUCCIONES = """
Actuá como un extractor de datos de tickets, facturas, recibos,
comprobantes bancarios, comprobantes de transferencias y capturas
de pagos realizados desde billeteras virtuales o aplicaciones financieras.

La imagen puede provenir de aplicaciones como Mercado Pago, Lemon,
Ualá, Personal Pay, bancos u otras plataformas similares.

Devolvé ÚNICAMENTE un objeto JSON válido, sin markdown ni texto adicional:

{
  "comprobante_detectado": true,
  "type": "expense",
  "amount": 0.0,
  "category": "other",
  "description": "Nombre del comercio - Tipo de comprobante",
  "date": "YYYY-MM-DD",
  "currency": "ARS",
  "payment_method": "other"
}

Reglas:
1. comprobante_detectado:
   - true si la imagen contiene un ticket, factura o comprobante de pago.
   - false si no corresponde a un comprobante válido.

2. type:
   - siempre "expense".

3. amount:
   - número decimal con el total pagado.
   - no devolver símbolos monetarios.

4. category:
   - devolver únicamente una de estas claves:
     food
     transport
     supermarket
     services
     health
     education
     entertainment
     clothing
     technology
     other

5. description:
   - texto breve con comercio y tipo de comprobante.

6. date:
   - formato YYYY-MM-DD.
   - si no se detecta, usar la fecha actual.

7. currency:
   - código ISO de tres letras.
   - usar ARS si no se puede identificar.

8. No inventar datos que no puedan inferirse razonablemente.

9. Si es una captura de una billetera virtual o banco:
   - usar como amount el monto total pagado o transferido;
   - usar como description el comercio, destinatario o concepto visible;
   - usar la fecha de la operación;
   - detectar la moneda;
   - considerar el comprobante válido aunque no tenga formato de ticket físico.

10. No considerar válidas:
   - pantallas de saldo;
   - menús de la aplicación;
   - promociones;
   - movimientos sin monto ni fecha;
   - imágenes sin evidencia de una operación concreta.

11. payment_method:
   - devolver únicamente una de estas claves:
     cash
     debit_card
     credit_card
     transfer
     bank_account
     digital_wallet
     contactless_payment
     deposit
     other

   - Mercado Pago, Lemon, Ualá, Personal Pay, MODO y billeteras similares:
     digital_wallet

   - Transferencia bancaria o entre cuentas:
     transfer

   - Comprobante de tarjeta de débito:
     debit_card

   - Comprobante de tarjeta de crédito:
     credit_card

   - Pago en efectivo:
     cash

   - Pago NFC o sin contacto:
     contactless_payment

   - Depósito bancario:
     deposit

   - Si no se puede determinar:
     other
"""

ALLOWED_CATEGORIES = {
    "food",
    "transport",
    "supermarket",
    "services",
    "health",
    "education",
    "entertainment",
    "clothing",
    "technology",
    "other",
}

ALLOWED_PAYMENT_METHODS = {
    "cash",
    "debit_card",
    "credit_card",
    "transfer",
    "bank_account",
    "digital_wallet",
    "contactless_payment",
    "deposit",
    "other",
}


@router.post("/ticket", status_code=status.HTTP_200_OK)
async def scan_ticket(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not API_KEY or client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="El servicio de análisis no está configurado.",
        )

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo enviado debe ser una imagen.",
        )

    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La imagen está vacía.",
            )

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=file.content_type,
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image_part, PROMPT_INSTRUCCIONES],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )

        result = json.loads(response.text)

    except HTTPException:
        raise

    except json.JSONDecodeError:
        logger.exception("Gemini devolvió un JSON inválido.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="La IA devolvió una respuesta inválida.",
        )

    except Exception as error:
        logger.exception("Error analizando comprobante: %r", error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo analizar el comprobante.",
        )

    if not result.get("comprobante_detectado", False):
        return {
            "status": "error",
            "message": "No se detectó un comprobante válido en la imagen.",
            "data": None,
        }

    try:
        amount = float(result.get("amount", 0))
    except (TypeError, ValueError):
        amount = 0

    category = str(result.get("category") or "other").lower().strip()
    if category not in ALLOWED_CATEGORIES:
        category = "other"

    description = str(
        result.get("description") or "Comprobante escaneado"
    ).strip()

    detected_date = str(result.get("date") or date.today().isoformat()).strip()
    currency = str(result.get("currency") or "ARS").upper().strip()

    payment_method = str(
        result.get("payment_method") or "other"
    ).lower().strip()
    if payment_method not in ALLOWED_PAYMENT_METHODS:
        payment_method = "other"

    return {
        "status": "success",
        "message": "Comprobante analizado correctamente.",
        "data": {
            "type": "expense",
            "amount": amount,
            "category": category,
            "description": description,
            "date": detected_date,
            "currency": currency,
            "payment_method": payment_method,
        },
    }
