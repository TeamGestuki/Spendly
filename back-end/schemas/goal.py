from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from typing import Optional, Literal, List
from schemas.goal_movement import GoalMovementResponse


class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)
    target_amount: float = Field(
        ..., gt=0, description="Monto objetivo debe ser mayor a cero"
    )
    currency: Optional[str] = Field("ARS", max_length=3)
    target_date: Optional[date] = None
    category: Optional[str] = Field(None, max_length=50)
    priority: Literal["low", "medium", "high"] = "medium"
    status: Literal["active", "paused", "completed", "cancelled"] = "active"
    color: str = Field("#4ADE80", max_length=20)
    icon: str = Field("📈", max_length=50)
    automatic_contribution_config: Optional[str] = Field(None, max_length=255)

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return v.upper()
        return v


class GoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)
    target_amount: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = Field(None, max_length=3)
    target_date: Optional[date] = None
    category: Optional[str] = Field(None, max_length=50)
    priority: Optional[Literal["low", "medium", "high"]] = None
    status: Optional[Literal["active", "paused", "completed", "cancelled"]] = None
    color: Optional[str] = Field(None, max_length=20)
    icon: Optional[str] = Field(None, max_length=50)
    automatic_contribution_config: Optional[str] = Field(None, max_length=255)

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return v.upper()
        return v


class GoalResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    target_amount: float
    current_amount: float
    currency: str
    target_date: Optional[date]
    category: Optional[str]
    priority: str
    status: str
    color: str
    icon: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    automatic_contribution_config: Optional[str]
    owner_id: int

    # Campos calculados
    porcentaje_progreso: float
    monto_restante: float
    dias_restantes: Optional[int]
    aporte_mensual_estimado: Optional[float]
    movements: List[GoalMovementResponse] = []

    class Config:
        from_attributes = True
