from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    date = Column(Date, nullable=False)
    currency = Column(String(10), default="ARS")
    
    # Clave foránea y relación con el Usuario
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")