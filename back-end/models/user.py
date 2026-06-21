from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(120), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    profile_image_url = Column(String(255), nullable=True)
    
    # Relaciones inversas (Un usuario tiene una lista de transacciones)
    transactions = relationship("Transaction", back_populates="owner")