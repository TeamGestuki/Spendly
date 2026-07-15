from datetime import datetime, timezone
from typing import List, Optional

from api.dependencies import get_current_user
from core.database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query, status
from models.goal import Goal
from models.goal_movement import GoalMovement
from models.user import User
from schemas.goal import GoalCreate, GoalResponse, GoalUpdate
from schemas.goal_movement import GoalMovementCreate, GoalMovementResponse
from sqlalchemy.orm import Session

router = APIRouter()


def get_user_goal(goal_id: int, user_id: int, db: Session) -> Goal:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.owner_id == user_id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meta no encontrada o no tienes permisos para acceder a ella",
        )
    return goal


def serialize_goal_obj(goal: Goal) -> GoalResponse:
    today = datetime.now(timezone.utc).date()

    # 1. Porcentaje de progreso
    if goal.target_amount > 0:
        porcentaje_progreso = round((goal.current_amount / goal.target_amount) * 100, 2)
    else:
        porcentaje_progreso = 0.0

    # 2. Monto restante
    monto_restante = max(0.0, round(goal.target_amount - goal.current_amount, 2))

    # 3. Días restantes
    dias_restantes = None
    if goal.target_date:
        dias_restantes = max(0, (goal.target_date - today).days)

    # 4. Aporte mensual estimado
    aporte_mensual_estimado = None
    if goal.current_amount < goal.target_amount:
        remaining = goal.target_amount - goal.current_amount
        if goal.target_date:
            days = (goal.target_date - today).days
            if days <= 0:
                aporte_mensual_estimado = round(remaining, 2)
            else:
                months = days / 30.0
                aporte_mensual_estimado = round(remaining / max(1.0, months), 2)
        else:
            aporte_mensual_estimado = None
    else:
        aporte_mensual_estimado = 0.0

    # 5. Mapear movimientos
    movements_list = []
    for mv in goal.movements:
        movements_list.append(
            GoalMovementResponse(
                id=mv.id,
                amount=mv.amount,
                type=mv.type,
                note=mv.note,
                date=mv.date,
                goal_id=mv.goal_id,
                owner_id=mv.owner_id,
            )
        )
    movements_list.sort(key=lambda x: x.date, reverse=True)

    status_str = goal.status if isinstance(goal.status, str) else goal.status.value
    priority_str = (
        goal.priority if isinstance(goal.priority, str) else goal.priority.value
    )

    return GoalResponse(
        id=goal.id,
        name=goal.name,
        description=goal.description,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        currency=goal.currency,
        target_date=goal.target_date,
        category=goal.category,
        priority=priority_str,
        status=status_str,
        color=goal.color,
        icon=goal.icon,
        created_at=goal.created_at,
        updated_at=goal.updated_at,
        completed_at=goal.completed_at,
        automatic_contribution_config=goal.automatic_contribution_config,
        owner_id=goal.owner_id,
        porcentaje_progreso=porcentaje_progreso,
        monto_restante=monto_restante,
        dias_restantes=dias_restantes,
        aporte_mensual_estimado=aporte_mensual_estimado,
        movements=movements_list,
    )


@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        if goal_data.target_amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El monto objetivo debe ser mayor a cero",
            )

        # Crear meta
        new_goal = Goal(
            name=goal_data.name,
            description=goal_data.description,
            target_amount=goal_data.target_amount,
            current_amount=0.0,
            currency=goal_data.currency.upper() if goal_data.currency else "ARS",
            target_date=goal_data.target_date,
            category=goal_data.category,
            priority=goal_data.priority,
            status=goal_data.status,
            color=goal_data.color,
            icon=goal_data.icon,
            automatic_contribution_config=goal_data.automatic_contribution_config,
            owner_id=current_user.id,
        )
        db.add(new_goal)
        db.commit()
        db.refresh(new_goal)
        return serialize_goal_obj(new_goal)
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear la meta: {str(e)}",
        )


@router.get("/", response_model=List[GoalResponse])
def list_goals(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Goal).filter(Goal.owner_id == current_user.id)
    if status:
        query = query.filter(Goal.status == status)
    if priority:
        query = query.filter(Goal.priority == priority)
    if category:
        query = query.filter(Goal.category == category)

    goals = query.all()
    return [serialize_goal_obj(g) for g in goals]


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal_detail(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    return serialize_goal_obj(goal)


@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    try:
        # Inicializar variables para recálculo preciso
        current_amount = goal.current_amount
        target_amount = goal.target_amount

        # Validar monto objetivo si se actualiza
        if goal_data.target_amount is not None:
            if goal_data.target_amount <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El monto objetivo debe ser mayor a cero",
                )
            goal.target_amount = goal_data.target_amount
            target_amount = goal_data.target_amount

        # Actualizar campos opcionales
        if goal_data.name is not None:
            goal.name = goal_data.name
        if goal_data.description is not None:
            goal.description = goal_data.description
        if goal_data.currency is not None:
            goal.currency = goal_data.currency.upper()
        if goal_data.target_date is not None:
            goal.target_date = goal_data.target_date
        if goal_data.category is not None:
            goal.category = goal_data.category
        if goal_data.priority is not None:
            goal.priority = goal_data.priority
        if goal_data.status is not None:
            goal.status = goal_data.status
        if goal_data.color is not None:
            goal.color = goal_data.color
        if goal_data.icon is not None:
            goal.icon = goal_data.icon
        if goal_data.automatic_contribution_config is not None:
            goal.automatic_contribution_config = goal_data.automatic_contribution_config

        # Recalcular estado de completado
        if current_amount >= target_amount:
            if goal.status != "completed":
                goal.status = "completed"
                goal.completed_at = datetime.now(timezone.utc)
        else:
            if goal.status == "completed":
                goal.status = "active"
                goal.completed_at = None

        db.commit()
        db.refresh(goal)
        return serialize_goal_obj(goal)
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar la meta: {str(e)}",
        )


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    try:
        db.delete(goal)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la meta: {str(e)}",
        )


@router.post("/{goal_id}/contributions", response_model=GoalResponse)
def add_contribution(
    goal_id: int,
    movement_data: GoalMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    amount = movement_data.amount
    mtype = movement_data.type

    # Validaciones de montos y tipos
    if mtype in ["aporte", "retiro"] and amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El monto para un {mtype} debe ser estrictamente mayor a cero",
        )
    if mtype == "ajuste" and amount == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El monto de ajuste no puede ser cero",
        )

    try:
        # Calcular nuevo monto actual de la meta
        current_amount = goal.current_amount
        if mtype == "aporte":
            current_amount += amount
        elif mtype == "retiro":
            if amount > goal.current_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No se puede retirar más dinero del disponible",
                )
            current_amount -= amount
        elif mtype == "ajuste":
            if goal.current_amount + amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El ajuste resultaría en un monto actual negativo",
                )
            current_amount += amount

        # Actualizar monto actual
        goal.current_amount = current_amount

        # Crear movimiento de meta
        movement = GoalMovement(
            amount=amount,
            type=mtype,
            note=movement_data.note,
            date=movement_data.date
            if movement_data.date
            else datetime.now(timezone.utc),
            goal_id=goal.id,
            owner_id=current_user.id,
        )
        db.add(movement)

        # Manejo de completado automático y reactivación
        target_amount = goal.target_amount
        if current_amount >= target_amount:
            if goal.status != "completed":
                goal.status = "completed"
                goal.completed_at = datetime.now(timezone.utc)
        else:
            if goal.status == "completed":
                goal.status = "active"
                goal.completed_at = None

        db.commit()
        db.refresh(goal)
        return serialize_goal_obj(goal)
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el movimiento: {str(e)}",
        )


@router.get("/{goal_id}/contributions", response_model=List[GoalMovementResponse])
def list_contributions(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    return [
        GoalMovementResponse(
            id=mv.id,
            amount=mv.amount,
            type=mv.type,
            note=mv.note,
            date=mv.date,
            goal_id=mv.goal_id,
            owner_id=mv.owner_id,
        )
        for mv in goal.movements
    ]


@router.delete(
    "/{goal_id}/contributions/{contribution_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_contribution(
    goal_id: int,
    contribution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    movement = (
        db.query(GoalMovement)
        .filter(
            GoalMovement.id == contribution_id,
            GoalMovement.goal_id == goal_id,
            GoalMovement.owner_id == current_user.id,
        )
        .first()
    )

    if not movement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movimiento no encontrado"
        )

    try:
        # Deshacer el impacto del movimiento eliminado en el progreso de la meta
        current_amount = goal.current_amount
        if movement.type == "aporte":
            current_amount = max(0.0, current_amount - movement.amount)
        elif movement.type == "retiro":
            current_amount += movement.amount
        elif movement.type == "ajuste":
            current_amount = max(0.0, current_amount - movement.amount)

        # Actualizar monto actual
        goal.current_amount = current_amount

        # Eliminar movimiento
        db.delete(movement)

        # Ajustar estado de completado
        target_amount = goal.target_amount
        if current_amount >= target_amount:
            if goal.status != "completed":
                goal.status = "completed"
                goal.completed_at = datetime.now(timezone.utc)
        else:
            if goal.status == "completed":
                goal.status = "active"
                goal.completed_at = None

        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el aporte: {str(e)}",
        )


@router.patch("/{goal_id}/pause", response_model=GoalResponse)
def pause_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    try:
        # Guardar estado actual antes de pausar para posibles reanudaciones
        current_amount = goal.current_amount
        target_amount = goal.target_amount

        goal.status = "paused"
        db.commit()
        db.refresh(goal)
        return serialize_goal_obj(goal)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al pausar la meta: {str(e)}",
        )


@router.patch("/{goal_id}/resume", response_model=GoalResponse)
def resume_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    try:
        # Volver a activa o completada según el monto actual
        current_amount = goal.current_amount
        target_amount = goal.target_amount

        if current_amount >= target_amount:
            goal.status = "completed"
            goal.completed_at = datetime.now(timezone.utc)
        else:
            goal.status = "active"
            goal.completed_at = None

        db.commit()
        db.refresh(goal)
        return serialize_goal_obj(goal)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al reanudar la meta: {str(e)}",
        )


@router.patch("/{goal_id}/cancel", response_model=GoalResponse)
def cancel_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = get_user_goal(goal_id, current_user.id, db)
    try:
        goal.status = "cancelled"
        db.commit()
        db.refresh(goal)
        return serialize_goal_obj(goal)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cancelar la meta: {str(e)}",
        )
