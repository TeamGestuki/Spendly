from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

class GoalMovementCreate(BaseModel):
    amount: float = Field(..., description="Monto del movimiento")
    type: Literal["aporte", "retiro", "ajuste"]
    note: Optional[str] = Field(None, max_length=255)
    date: Optional[datetime] = None

class GoalMovementResponse(BaseModel):
    id: int
    amount: float
    type: str
    note: Optional[str]
    date: datetime
    goal_id: int
    owner_id: int

    class Config:
        from_attributes = True
