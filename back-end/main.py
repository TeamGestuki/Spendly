#punto de entrada de la app
from fastapi import FastAPI
from core.database import engine, Base
from models import user, transaction  # Importante para que SQLAlchemy reconozca y cree las tablas
from api.routes import auth, transaction as transaction_router

# Esto crea las tablas en la base de datos de forma automática si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="App de Gestión Inteligente de Gastos",
    description="API para gestión financiera personal con OCR e IA",
    version="1.0.0"
)

# Registramos las rutas de autenticación
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticación"])
app.include_router(transaction_router.router, prefix="/api/v1/transactions", tags=["Transacciones"])

@app.get("/")
def read_root():
    return {"message": "¡El backend está vivo y la base de datos conectada!"}