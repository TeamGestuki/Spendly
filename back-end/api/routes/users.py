from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from models.user import User
from api.dependencies import get_current_user
from core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/heartbeat")
def update_heartbeat(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    current_user.last_heartbeat_at = now
    db.commit()

    return {
        "message": "Heartbeat actualizado",
        "last_heartbeat_at": now.isoformat(),
    }
