from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base


class GoalMovement(Base):
    __tablename__ = "goal_movements"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(String(20), nullable=False)  # "aporte", "retiro", "ajuste"
    note = Column(String(255), nullable=True)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    goal_id = Column(
        Integer, ForeignKey("goals.id", ondelete="CASCADE"), nullable=False
    )
    owner_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    # Relaciones inversas (Un usuario tiene una lista de transacciones)
    # No son relación que se ven en la base de datos
    goal = relationship("Goal", back_populates="movements")
    owner = relationship("User", back_populates="goal_movements")
