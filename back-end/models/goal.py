from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    currency = Column(String(3), default="ARS", nullable=False)
    target_date = Column(Date, nullable=True)
    category = Column(String(50), nullable=True)
    priority = Column(String(20), default="medium", nullable=False)  # "low", "medium", "high"
    status = Column(String(20), default="active", nullable=False)    # "active", "paused", "completed", "cancelled"
    color = Column(String(20), default="#4ADE80", nullable=False)
    icon = Column(String(50), default="📈", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, onupdate=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    automatic_contribution_config = Column(String(255), nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="goals")
    movements = relationship("GoalMovement", back_populates="goal", cascade="all, delete-orphan")
