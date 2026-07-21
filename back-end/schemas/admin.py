from datetime import datetime
from typing import Optional, Literal, List
from pydantic import BaseModel, Field


# ─── User info (inline in responses) ──────────────────────────

class AdminUserInfo(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


# ─── User management ──────────────────────────────────────────

class AdminUserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    is_online: bool = False
    last_heartbeat_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminUserListResponse(BaseModel):
    items: List[AdminUserResponse]
    page: int
    page_size: int
    total: int
    pages: int


class AdminUserStatusUpdate(BaseModel):
    is_active: bool


class AdminUserRoleUpdate(BaseModel):
    role: Literal["user", "admin"]


# ─── Dashboard ────────────────────────────────────────────────

class AdminDashboardUsers(BaseModel):
    total: int
    active: int
    inactive: int
    admins: int
    online: int


class AdminDashboardReports(BaseModel):
    total: int
    open: int
    in_review: int
    resolved: int
    closed: int


class AdminDashboardSystem(BaseModel):
    api: str = "online"
    database: str = "online"
    email_configured: bool
    environment: str
    app_version: str


class AdminDashboardResponse(BaseModel):
    users: AdminDashboardUsers
    reports: AdminDashboardReports
    system: AdminDashboardSystem


# ─── Online users ─────────────────────────────────────────────

class AdminOnlineUsersResponse(BaseModel):
    online_count: int
    threshold_seconds: int
    users: List[AdminUserResponse]


# ─── Reports ──────────────────────────────────────────────────

class AdminReportResponse(BaseModel):
    id: int
    category: str
    subject: str
    description: str
    status: str
    created_at: Optional[datetime] = None
    user: AdminUserInfo
    admin_response: Optional[str] = None
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminReportListResponse(BaseModel):
    items: List[AdminReportResponse]
    page: int
    page_size: int
    total: int
    pages: int


class AdminReportStatusUpdate(BaseModel):
    status: Literal["open", "in_review", "resolved", "closed"]


class AdminReportReplyRequest(BaseModel):
    message: str = Field(..., min_length=1)


class AdminReportReplyResponse(BaseModel):
    report: AdminReportResponse
    email_sent: bool
    message: str


# ─── Activity log ─────────────────────────────────────────────

class AdminActivityLogResponse(BaseModel):
    id: int
    action: str
    target_type: str
    target_id: Optional[int] = None
    details: Optional[str] = None
    created_at: Optional[datetime] = None
    admin: AdminUserInfo

    class Config:
        from_attributes = True


class AdminActivityLogListResponse(BaseModel):
    items: List[AdminActivityLogResponse]
    page: int
    page_size: int
    total: int
    pages: int


# ─── Tools ────────────────────────────────────────────────────

class AdminNotificationCreate(BaseModel):
    type: Literal["simple", "goal", "reminder", "warning"] = "simple"


class AdminNotificationResponse(BaseModel):
    success: bool
    notification_id: Optional[int] = None
    message: str


class AdminEmailTestRequest(BaseModel):
    subject: Optional[str] = "Prueba de Spendly"
    message: Optional[str] = "El servicio de correo está funcionando correctamente."


class AdminEmailTestResponse(BaseModel):
    success: bool
    message: str


class AdminSystemHealthResponse(BaseModel):
    status: str = "ok"
    healthy: bool = True
    database: dict
    email_service: dict
    environment: str
    app_version: str
    server_time: datetime


class AdminScannerHealthResponse(BaseModel):
    configured: bool
