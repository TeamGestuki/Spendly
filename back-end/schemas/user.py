from pydantic import BaseModel, EmailStr, Field

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
    preferred_currency: str = "ARS"

    class Config:
        from_attributes = True

# ─── Token JWT ────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

class MessageResponse(BaseModel):
    message: str

class UpdateProfile(BaseModel):
    full_name: str | None = None
    preferred_currency: str | None = None

class ConfirmPassword(BaseModel):
    current_password: str