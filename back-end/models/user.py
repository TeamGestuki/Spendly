from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relaciones inversas (Un usuario tiene listas de ingresos y gastos)
    incomes = relationship("Income", back_populates="owner")
    expenses = relationship("Expense", back_populates="owner")