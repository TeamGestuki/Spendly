from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

PaymentMethod = Literal[
    "cash",
    "debit_card",
    "credit_card",
    "transfer",
    "bank_account",
    "digital_wallet",
    "contactless_payment",
    "deposit",
    "other",
]

class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    amount: float
    category: Optional[str] = None
    description: Optional[str] = None
    date: date
    currency: Optional[str] = "ARS"
    payment_method: Optional[PaymentMethod] = None

class TransactionUpdate(BaseModel):
    type: Optional[Literal["income", "expense"]] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    currency: Optional[str] = None
    payment_method: Optional[PaymentMethod] = None

class TransactionResponse(TransactionCreate):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
