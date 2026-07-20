from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from models.password_reset_code import PasswordResetCode
from models.password_reset_token import PasswordResetToken
from models.session import UserSession
from core.security import get_password_hash


class TestRegister:
    def test_register_user(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "full_name": "Test User",
            "email": "new@test.com",
            "password": "Test1234!",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "new@test.com"
        assert data["full_name"] == "Test User"
        assert "id" in data
        assert "hashed_password" not in data

    def test_register_duplicate_email(self, client):
        payload = {
            "full_name": "Test User",
            "email": "dup@test.com",
            "password": "Test1234!",
        }
        client.post("/api/v1/auth/register", json=payload)
        resp = client.post("/api/v1/auth/register", json=payload)
        assert resp.status_code == 400
        assert "ya se encuentra registrado" in resp.json()["detail"]


class TestLogin:
    def test_login_success(self, client):
        client.post("/api/v1/auth/register", json={
            "full_name": "Login User",
            "email": "login@test.com",
            "password": "Test1234!",
        })
        resp = client.post("/api/v1/auth/login", data={
            "username": "login@test.com",
            "password": "Test1234!",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        client.post("/api/v1/auth/register", json={
            "full_name": "Login User",
            "email": "login2@test.com",
            "password": "Test1234!",
        })
        resp = client.post("/api/v1/auth/login", data={
            "username": "login2@test.com",
            "password": "WrongPassword!",
        })
        assert resp.status_code == 401

    def test_login_nonexistent_user(self, client):
        resp = client.post("/api/v1/auth/login", data={
            "username": "ghost@test.com",
            "password": "Test1234!",
        })
        assert resp.status_code == 401


class TestGetMe:
    def test_get_me_authenticated(self, client, auth_headers):
        resp = client.get("/api/v1/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "test@test.com"
        assert data["full_name"] == "Test User"

    def test_get_me_no_token(self, client):
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 401


class TestForgotPassword:
    @patch("api.routes.auth.send_password_reset_email")
    def test_forgot_password_existing_email(self, mock_email, client):
        client.post("/api/v1/auth/register", json={
            "full_name": "Reset User",
            "email": "reset@test.com",
            "password": "Test1234!",
        })
        resp = client.post("/api/v1/auth/forgot-password", json={
            "email": "reset@test.com",
        })
        assert resp.status_code == 200
        assert "recibirás un código" in resp.json()["message"]

    def test_forgot_password_nonexistent_email(self, client):
        resp = client.post("/api/v1/auth/forgot-password", json={
            "email": "ghost@test.com",
        })
        assert resp.status_code == 200
        assert "recibirás un código" in resp.json()["message"]


class TestVerifyResetCode:
    def _create_code_for_user(self, client, db, user_email, code="123456"):
        client.post("/api/v1/auth/register", json={
            "full_name": "Code User",
            "email": user_email,
            "password": "Test1234!",
        })
        from models.user import User
        user = db.query(User).filter(User.email == user_email).first()
        code_hash = get_password_hash(code)
        reset_code = PasswordResetCode(
            user_id=user.id,
            code_hash=code_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            attempts=0,
            used=False,
        )
        db.add(reset_code)
        db.commit()
        return user

    def test_verify_code_correct(self, client, db):
        user = self._create_code_for_user(client, db, "verify@test.com", code="481263")
        resp = client.post("/api/v1/auth/verify-reset-code", json={
            "email": "verify@test.com",
            "code": "481263",
        })
        assert resp.status_code == 200
        assert "reset_token" in resp.json()

    def test_verify_code_wrong(self, client, db):
        user = self._create_code_for_user(client, db, "wrong@test.com", code="111111")
        resp = client.post("/api/v1/auth/verify-reset-code", json={
            "email": "wrong@test.com",
            "code": "999999",
        })
        assert resp.status_code == 400
        assert "incorrecto" in resp.json()["detail"]

    def test_verify_code_max_attempts(self, client, db):
        user = self._create_code_for_user(client, db, "maxatt@test.com", code="222222")
        for _ in range(5):
            client.post("/api/v1/auth/verify-reset-code", json={
                "email": "maxatt@test.com",
                "code": "000000",
            })
        resp = client.post("/api/v1/auth/verify-reset-code", json={
            "email": "maxatt@test.com",
            "code": "000000",
        })
        assert resp.status_code == 400
        detail = resp.json()["detail"]
        assert "máxima" in detail or "venció" in detail


class TestResetPassword:
    def _get_reset_token(self, client, db, email, code="333333"):
        client.post("/api/v1/auth/register", json={
            "full_name": "Reset PW User",
            "email": email,
            "password": "OldPass123!",
        })
        from models.user import User
        user = db.query(User).filter(User.email == email).first()
        code_hash = get_password_hash(code)
        reset_code = PasswordResetCode(
            user_id=user.id,
            code_hash=code_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            attempts=0,
            used=True,
            verified_at=datetime.now(timezone.utc),
        )
        db.add(reset_code)
        token_hash = get_password_hash("valid-token-abc")
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
            used=False,
        )
        db.add(reset_token)
        db.commit()
        return "valid-token-abc"

    def test_reset_password_valid_token(self, client, db):
        token = self._get_reset_token(client, db, "resetpw@test.com")
        resp = client.post("/api/v1/auth/reset-password", json={
            "reset_token": token,
            "new_password": "NewPass1234!",
        })
        assert resp.status_code == 200
        assert "actualizada" in resp.json()["message"]

        resp = client.post("/api/v1/auth/login", data={
            "username": "resetpw@test.com",
            "password": "NewPass1234!",
        })
        assert resp.status_code == 200

    def test_reset_password_old_password_fails(self, client, db):
        token = self._get_reset_token(client, db, "oldpw@test.com")
        client.post("/api/v1/auth/reset-password", json={
            "reset_token": token,
            "new_password": "NewPass1234!",
        })
        resp = client.post("/api/v1/auth/login", data={
            "username": "oldpw@test.com",
            "password": "OldPass123!",
        })
        assert resp.status_code == 401

    def test_reset_password_sessions_revoked(self, client, db):
        client.post("/api/v1/auth/register", json={
            "full_name": "Revoke User",
            "email": "revoke@test.com",
            "password": "Revoke123!",
        })
        client.post("/api/v1/auth/login", data={
            "username": "revoke@test.com",
            "password": "Revoke123!",
        })

        from models.user import User
        user = db.query(User).filter(User.email == "revoke@test.com").first()
        code_hash = get_password_hash("555555")
        reset_code = PasswordResetCode(
            user_id=user.id,
            code_hash=code_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
            attempts=0,
            used=True,
            verified_at=datetime.now(timezone.utc),
        )
        db.add(reset_code)
        token_raw = "revoke-test-token"
        token_hash = get_password_hash(token_raw)
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
            used=False,
        )
        db.add(reset_token)
        db.commit()

        client.post("/api/v1/auth/reset-password", json={
            "reset_token": token_raw,
            "new_password": "Revoked1234!",
        })

        sessions = db.query(UserSession).filter(
            UserSession.user_id == user.id,
            UserSession.revoked_at.is_not(None),
        ).all()
        assert len(sessions) >= 1

    def test_reset_password_invalid_token(self, client):
        resp = client.post("/api/v1/auth/reset-password", json={
            "reset_token": "totally-invalid-token",
            "new_password": "NewPass1234!",
        })
        assert resp.status_code == 400
