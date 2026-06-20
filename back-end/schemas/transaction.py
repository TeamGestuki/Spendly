from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    amount: float
    category: Optional[str] = None
    description: Optional[str] = None
    date: date
    currency: Optional[str] = "ARS"

class TransactionResponse(TransactionCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
