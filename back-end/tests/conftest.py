import os

os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["DATABASE_URL"] = "sqlite://"

import dotenv
_real_load_dotenv = dotenv.load_dotenv
dotenv.load_dotenv = lambda *a, **kw: None

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import pytest

from core.database import Base, get_db

dotenv.load_dotenv = _real_load_dotenv

from main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def _register_and_login(client, email="test@test.com", password="Test1234!", name="Test User"):
    client.post("/api/v1/auth/register", json={
        "full_name": name,
        "email": email,
        "password": password,
    })
    resp = client.post("/api/v1/auth/login", data={
        "username": email,
        "password": password,
    })
    token = resp.json()["access_token"]
    return token


@pytest.fixture
def auth_headers(client):
    token = _register_and_login(client)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def second_auth_headers(client):
    token = _register_and_login(client, email="other@test.com", password="Other1234!", name="Other User")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(client, db):
    token = _register_and_login(client, email="admin@test.com", password="Admin1234!", name="Admin User")
    from models.user import User
    user = db.query(User).filter(User.email == "admin@test.com").first()
    user.role = "admin"
    db.commit()
    return {"Authorization": f"Bearer {token}"}
