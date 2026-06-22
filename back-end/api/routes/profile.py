from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.storage import save_avatar, delete_avatar, MAX_FILE_SIZE
from models.user import User
from schemas.user import UserResponse
from api.dependencies import get_current_user

router = APIRouter()

@router.post("/avatar", response_model=UserResponse)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, "La imagen supera los 5 MB.")

    try:
        url = save_avatar(contents, file.filename or "avatar.jpg")
    except ValueError as e:
        raise HTTPException(400, str(e))

    current_user.profile_image_url = url
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/avatar", response_model=UserResponse)
def delete_avatar_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    old_url = current_user.profile_image_url
    current_user.profile_image_url = None
    db.commit()
    db.refresh(current_user)
    delete_avatar(old_url)
    return current_user
