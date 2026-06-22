import os
import uuid

UPLOAD_DIR = "uploads/avatars"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def save_avatar(file_content: bytes, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Formato no soportado: {ext}")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)

    with open(path, "wb") as f:
        f.write(file_content)

    return f"/uploads/avatars/{name}"

def delete_avatar(url: str | None) -> None:
    if not url:
        return
    path = os.path.join(UPLOAD_DIR, os.path.basename(url))
    if os.path.exists(path):
        os.remove(path)
