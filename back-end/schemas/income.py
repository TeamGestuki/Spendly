from pydantic import BaseModel
from datetime import date
from typing import Optional

# Datos base compartidos
class IncomeBase(BaseModel):
    amount: float
    description: Optional[str] = None
    date: date

# Datos que requiere el endpoint POST (hereda de IncomeBase)
class IncomeCreate(IncomeBase):
    pass

# Datos que devuelve la API (incluye el ID generado por la BD)
class IncomeResponse(IncomeBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True