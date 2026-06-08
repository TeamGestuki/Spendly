from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.income import Income
from models.user import User
from schemas.income import IncomeCreate, IncomeResponse
from api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    income_data: IncomeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # ¡Acá exigimos el Token!
):
    # Armamos el ingreso vinculándolo al ID del usuario que está haciendo la petición
    new_income = Income(
        amount=income_data.amount,
        description=income_data.description,
        date=income_data.date,
        owner_id=current_user.id
    )
    
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    
    return new_income

@router.get("/", response_model=List[IncomeResponse])
def get_incomes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # ¡Acá también exigimos el Token!
):
    # Buscamos en la base de datos SOLO los ingresos que pertenezcan a este usuario
    incomes = db.query(Income).filter(Income.owner_id == current_user.id).all()
    return incomes