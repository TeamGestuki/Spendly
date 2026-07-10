from pydantic import BaseModel
from datetime import datetime

class SessionResponse(BaseModel):
    id: int
    device_name: str | None
    ip_address: str | None
    user_agent: str | None
    created_at: datetime
    last_seen_at: datetime
    is_current: bool = False

    class Config:
        from_attributes = True
