#punto de entrada de la app
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from core.database import engine, Base
from models import user, transaction, session, goal, goal_movement, support_report, password_reset_code, password_reset_token, notification, admin_activity_log
from api.routes import auth, transaction as transaction_router, profile as profile_router, scan, goal as goal_router, support, users, admin, admin_users, admin_reports, admin_tools

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
app.include_router(scan.router,  prefix="/api/v1/scan", tags=["Escaneo de Tickets"])
app.include_router(goal_router.router, prefix="/api/v1/goals", tags=["Metas Financieras"])
app.include_router(support.router, prefix="/api/v1/support", tags=["Reportes de Soporte"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Usuarios"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(admin_users.router, prefix="/api/v1/admin", tags=["Admin - Usuarios"])
app.include_router(admin_reports.router, prefix="/api/v1/admin", tags=["Admin - Reportes"])
app.include_router(admin_tools.router, prefix="/api/v1/admin", tags=["Admin - Herramientas"])

@app.get("/")
def read_root():
    return {"message": "¡El backend está vivo y la base de datos conectada!"}