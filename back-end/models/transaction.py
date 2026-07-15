from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(10), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=True)
    description = Column(String(255), nullable=True)
    date = Column(Date, nullable=False)
    currency = Column(String(10), default="ARS")
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relaciones inversas (Un usuario tiene una lista de transacciones)
    # No son relación que se ven en la base de datos
    owner = relationship("User", back_populates="transactions")
