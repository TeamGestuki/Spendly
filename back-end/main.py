#punto de entrada de la app
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from core.database import engine, Base
from models import user, transaction, session
from api.routes import auth, transaction as transaction_router, profile as profile_router

# Esto crea las tablas en la base de datos de forma automática si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="App de Gestión Inteligente de Gastos",
    description="API para gestión financiera personal con OCR e IA",
    version="1.0.0"
)

os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Registramos las rutas
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticación"])
app.include_router(transaction_router.router, prefix="/api/v1/transactions", tags=["Transacciones"])
app.include_router(profile_router.router, prefix="/api/v1/profile", tags=["Perfil"])

@app.get("/")
def read_root():
    return {"message": "¡El backend está vivo y la base de datos conectada!"}