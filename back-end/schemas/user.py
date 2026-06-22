from pydantic import BaseModel, EmailStr, Field

# Esquema base con campos comunes
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

# Datos necesarios para el registro
class UserCreate(UserBase):
    password: str

# Datos que la API va a responder (No exponemos la contraseña)
class UserResponse(UserBase):
    id: int
    is_active: bool
    profile_image_url: str | None = None

    # Habilita la compatibilidad con modelos de SQLAlchemy
    class Config:
        from_attributes = True

# Esquema para responder con el Token
class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

class MessageResponse(BaseModel):
    message: str