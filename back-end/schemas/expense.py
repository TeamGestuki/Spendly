from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpenseBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: date
    currency: Optional[str] = "ARS" # ARS por defecto como pide el MVP

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True