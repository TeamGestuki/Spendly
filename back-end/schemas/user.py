from pydantic import BaseModel, EmailStr

# ─── Esquema base con campos comunes ──────────────────────────
class UserBase(BaseModel):
    full_name: str
    email: EmailStr

# ─── Datos necesarios para el registro ────────────────────────
class UserCreate(UserBase):
    password: str

# ─── Datos que devuelve la API (sin contraseña) ───────────────
class UserResponse(UserBase):
    id: int
    is_active: bool
    profile_image_url: str | None = None

    class Config:
        from_attributes = True

# ─── Token JWT ────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str