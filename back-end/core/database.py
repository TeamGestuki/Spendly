from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Por ahora usaremos SQLite para probar rápido sin tener que instalar servidores.
# Cuando el Integrante 2 tenga MariaDB listo, solo cambiaremos esta URL.
SQLALCHEMY_DATABASE_URL = "sqlite:///./gastos_app.db"

# connect_args={"check_same_thread": False} es necesario solo para SQLite en FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()