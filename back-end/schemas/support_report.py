from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field

class SupportReportCategory(str, Enum):
    TRANSACTIONS = "transactions"
    PROFILE = "profile"
    AUTHENTICATION = "authentication"
    SCAN = "scan"
    STATISTICS = "statistics"
    GOALS = "goals"
    NOTIFICATIONS = "notifications"
    APPEARANCE = "appearance"
    LANGUAGE = "language"
    CURRENCY = "currency"
    PERFORMANCE = "performance"
    OTHER = "other"

class SupportReportStatus(str, Enum):
    OPEN = "open"
    IN_REVIEW = "in_review"
    RESOLVED = "resolved"
    CLOSED = "closed"

class SupportReportBase(BaseModel):
    category: SupportReportCategory = Field(..., description="Categoría del reporte")
    subject: str = Field(..., min_length=5, max_length=150, description="Asunto del reporte")
    description: str = Field(..., min_length=10, description="Descripción detallada del problema")
    steps_to_reproduce: Optional[str] = Field(None, description="Pasos para reproducir el problema")
    include_technical_info: bool = Field(default=False, description="Incluir información técnica del dispositivo")
    app_version: Optional[str] = Field(None, max_length=30, description="Versión de la aplicación")
    platform: Optional[str] = Field(None, max_length=30, description="Plataforma (android/ios/web)")
    os_version: Optional[str] = Field(None, max_length=100, description="Versión del sistema operativo")
    device_model: Optional[str] = Field(None, max_length=150, description="Modelo del dispositivo")

class SupportReportCreate(SupportReportBase):
    pass

class SupportReportUpdate(BaseModel):
    subject: Optional[str] = Field(None, min_length=5, max_length=150)
    description: Optional[str] = Field(None, min_length=10)
    steps_to_reproduce: Optional[str] = Field(None)
    include_technical_info: Optional[bool] = None
    app_version: Optional[str] = Field(None, max_length=30)
    platform: Optional[str] = Field(None, max_length=30)
    os_version: Optional[str] = Field(None, max_length=100)
    device_model: Optional[str] = Field(None, max_length=150)
    status: Optional[SupportReportStatus] = None
    admin_response: Optional[str] = None
    resolved_at: Optional[datetime] = None

class SupportReportResponse(SupportReportBase):
    id: int
    user_id: int
    status: SupportReportStatus
    admin_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SupportReportListItem(BaseModel):
    id: int
    category: SupportReportCategory
    subject: str
    status: SupportReportStatus
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True