from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.transaction import Transaction
from models.user import User
from schemas.transaction import TransactionCreate, TransactionResponse
from api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_transaction = Transaction(
        type=transaction_data.type,
        amount=transaction_data.amount,
        category=transaction_data.category,
        description=transaction_data.description,
        date=transaction_data.date,
        currency=transaction_data.currency,
        payment_method=transaction_data.payment_method,
        owner_id=current_user.id
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    type: Optional[str] = Query(None, pattern="^(income|expense)?$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.owner_id == current_user.id)
    if type:
        query = query.filter(Transaction.type == type)
    transactions = query.all()
    return transactions

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.owner_id == current_user.id
    ).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transacción no encontrada o no tienes permiso para eliminarla"
        )
    db.delete(transaction)
    db.commit()
    return
