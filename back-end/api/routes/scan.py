import json
import logging
import os
from datetime import datetime

from api.dependencies import get_current_user

# Importamos las dependencias del proyecto
from core.database import get_db
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from google import genai
from google.genai import types
from models.transaction import Transaction
from models.user import User
from sqlalchemy.orm import Session

router = APIRouter()

# Configuramos un logger para ver alertas amigables en la terminal
logger = logging.getLogger(__name__)

# Configuración de Gemini
API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=API_KEY)

PROMPT_INSTRUCCIONES = """
Actúa como un extractor de datos de tickets de compra y comprobantes de gastos optimizado para bases de datos relacionales.
Analiza la imagen provista y extrae la información requerida. 

Es obligatorio que devuelvas ÚNICAMENTE un objeto JSON con la estructura exacta del siguiente ejemplo, sin agregar formato markdown (sin ```json), ni textos explicativos:

{
  "comprobante_detectado": true,
  "type": "expense",
  "amount": 0.0,
  "category": "string o null (ej: Alimentos, Transporte, Indumentaria, Servicios, etc.)",
  "description": "string (Formato: 'Nombre del Comercio - Tipo de Comprobante')",
  "date": "YYYY-MM-DD",
  "currency": "string (ej: ARS, USD)"
}

Reglas estrictas de extracción:
1. "comprobante_detectado": Cambiar a false si la imagen no corresponde a un ticket, factura o comprobante de pago.
2. "type": Siempre debe ser el texto "expense" (ya que representa un gasto de un ticket).
3. "amount": Debe ser un número decimal (Float) con el total absoluto pagado en el ticket.
4. "description": Debe combinar el nombre del comercio emisor y el tipo de comprobante de forma concisa.
5. "date": La fecha de emisión en formato estricto YYYY-MM-DD. Si no se encuentra, usar la fecha actual.
6. "currency": Código de tres letras de la moneda (si no se especifica, usar "ARS").
"""


@router.post("/ticket", status_code=status.HTTP_200_OK)
async def escanear_ticket(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),  # <-- Sigue comentado hasta que usen Login
):
    # 1. Validar formato de archivo
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo enviado debe ser una imagen.",
        )

    try:
        # 2. Leer los bytes de la imagen provista por el frontend
        image_bytes = await file.read()

        # 3. Preparar el formato binario para la API de Gemini
        image_part = types.Part.from_bytes(
            data=image_bytes, mime_type=file.content_type
        )

        # 4. Llamar a Gemini (Modelo flash 2.5) pidiendo respuesta JSON estructurada
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[image_part, PROMPT_INSTRUCCIONES],
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )

        # 5. Transformar el texto de la IA en un diccionario Python
        resultado_json = json.loads(response.text)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar la estructura JSON devuelta por la IA.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el procesamiento del ticket con Gemini: {str(e)}",
        )

    # 6. LÓGICA DE BASE DE DATOS (Mapeo inteligente con control de errores)
    if not resultado_json.get("comprobante_detectado", False):
        return {
            "status": "error",
            "message": "No se pudo detectar un comprobante válido en la imagen.",
            "data": resultado_json,
        }

    monto = float(resultado_json.get("amount", 0.0))

    categoria = resultado_json.get("category", "Otros")

    descripcion = resultado_json.get("descripcion", "Ticket escaneado")

    moneda = resultado_json.get("currency", "ARS")

    fecha_str = resultado_json.get("date")

    try:
        # ID de usuario fijo provisional (ID 1) hasta que vuelvan a activar 'current_user'
        id_usuario = current_user

        nueva_transaccion = Transaction(
            type="expense",
            amount=monto,
            category=categoria,
            description=descripcion,
            date=fecha_str,
            currency=moneda,
            owner_id=id_usuario,
        )

        db.add(nueva_transaccion)
        db.commit()
        db.refresh(nueva_transaccion)

        logger.info(
            f"¡Éxito! Transacción guardada en BD con ID: {nueva_transaccion.id}"
        )

        return {
            "status": "success",
            "message": "Ticket escaneado y guardado en la base de datos con éxito.",
            "transaction_id": nueva_transaccion.id,
            "data": resultado_json,
        }

    except Exception as bd_error:
        # MODO TESTING SEGURO: Si la base de datos falla o no está conectada,
        # cancela la transacción fallida, te avisa en consola y te devuelve el JSON igual.
        db.rollback()
        logger.warning(f"Bypass de BD activado: {str(bd_error)}")

        return {
            "status": "success_mock",
            "message": "Ticket procesado por IA correctamente (Modo de prueba sin Base de Datos).",
            "error_bd_detalle": str(bd_error),
            "data": resultado_json,
        }
