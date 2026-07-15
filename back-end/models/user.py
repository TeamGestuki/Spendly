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
    preferred_currency = Column(String(3), default="ARS", nullable=False)
    role = Column(String(20), default="user", nullable=False)

    # Relaciones inversas (Un usuario tiene una lista de transacciones)
    # No son relación que se ven en la base de datos
    transactions = relationship("Transaction", back_populates="owner")
    goals = relationship("Goal", back_populates="owner", cascade="all, delete-orphan")
    goal_movements = relationship(
        "GoalMovement", back_populates="owner", cascade="all, delete-orphan"
    )
