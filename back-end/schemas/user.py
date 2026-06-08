from pydantic import BaseModel, EmailStr

# Esquema base con campos comunes
class UserBase(BaseModel):
    email: EmailStr

# Datos necesarios para el registro
class UserCreate(UserBase):
    password: str

# Datos que la API va a responder (No exponemos la contraseña)
class UserResponse(UserBase):
    id: int
    is_active: bool

    # Habilita la compatibilidad con modelos de SQLAlchemy
    class Config:
        from_attributes = True
# ... (deja lo que ya tenías de UserBase, UserCreate, UserResponse)

# Esquema para responder con el Token
class Token(BaseModel):
    access_token: str
    token_type: str