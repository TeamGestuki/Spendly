from pydantic import BaseModel, EmailStr, Field


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class ResetPasswordRequest(BaseModel):
    reset_token: str = Field(min_length=10)
    new_password: str = Field(min_length=8)


class ResetTokenResponse(BaseModel):
    reset_token: str
