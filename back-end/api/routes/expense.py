from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.expense import Expense
from models.user import User
from schemas.expense import ExpenseCreate, ExpenseResponse
from api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_data: ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Creamos el gasto vinculándolo al usuario logueado
    new_expense = Expense(
        amount=expense_data.amount,
        category=expense_data.category,
        description=expense_data.description,
        date=expense_data.date,
        currency=expense_data.currency,
        owner_id=current_user.id
    )
    
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return new_expense

@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Traemos solo los gastos del usuario actual
    expenses = db.query(Expense).filter(Expense.owner_id == current_user.id).all()
    return expenses

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscamos el gasto asegurándonos de que le pertenezca a este usuario
    expense = db.query(Expense).filter(
        Expense.id == expense_id, 
        Expense.owner_id == current_user.id
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Gasto no encontrado o no tienes permiso para eliminarlo"
        )
        
    db.delete(expense)
    db.commit()
    return # Retorna 204 No Content (No devuelve cuerpo, solo el estado de éxito)