from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Income(Base):
    __tablename__ = "incomes"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)
    date = Column(Date, nullable=False)
    
    # Clave foránea y relación con el Usuario
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="incomes")