from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


class SupportReport(Base):
    __tablename__ = "support_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    subject = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    steps_to_reproduce = Column(Text, nullable=True)
    include_technical_info = Column(Boolean, default=False)
    app_version = Column(String(30), nullable=True)
    platform = Column(String(30), nullable=True)
    os_version = Column(String(100), nullable=True)
    device_model = Column(String(150), nullable=True)
    status = Column(String(30), default="open", nullable=False)
    admin_response = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relaciones inversas (Un usuario tiene una lista de transacciones)
    # No son relación que se ven en la base de datos
    user = relationship("User", backref="support_reports")

