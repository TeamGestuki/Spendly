from unittest.mock import patch
from datetime import datetime, timedelta, timezone


class TestRoleProtection:
    def test_normal_user_gets_403_on_admin_dashboard(self, client, auth_headers):
        resp = client.get("/api/v1/admin/dashboard", headers=auth_headers)
        assert resp.status_code == 403

    def test_normal_user_gets_403_on_admin_users(self, client, auth_headers):
        resp = client.get("/api/v1/admin/users", headers=auth_headers)
        assert resp.status_code == 403

    def test_normal_user_gets_403_on_admin_reports(self, client, auth_headers):
        resp = client.get("/api/v1/admin/reports", headers=auth_headers)
        assert resp.status_code == 403

    def test_normal_user_gets_403_on_admin_tools(self, client, auth_headers):
        resp = client.get("/api/v1/admin/tools/health", headers=auth_headers)
        assert resp.status_code == 403


class TestDashboard:
    def test_admin_accesses_dashboard(self, client, admin_headers):
        resp = client.get("/api/v1/admin/dashboard", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "users" in data
        assert "reports" in data
        assert "system" in data
        assert data["users"]["total"] >= 1
        assert data["users"]["admins"] >= 1
        assert "email_configured" in data["system"]


class TestHeartbeat:
    def test_heartbeat_updates_timestamp(self, client, auth_headers):
        resp = client.post("/api/v1/users/heartbeat", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["message"] == "Heartbeat actualizado"
        assert "last_heartbeat_at" in data

    def test_user_appears_online_after_heartbeat(self, client, auth_headers, admin_headers):
        client.post("/api/v1/users/heartbeat", headers=auth_headers)
        resp = client.get("/api/v1/admin/online-users", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["online_count"] >= 1

    def test_user_disappears_after_threshold(self, client, auth_headers, admin_headers, db):
        client.post("/api/v1/users/heartbeat", headers=auth_headers)
        from models.user import User
        user = db.query(User).filter(User.email == "test@test.com").first()
        user.last_heartbeat_at = datetime.now(timezone.utc) - timedelta(seconds=200)
        db.commit()
        resp = client.get("/api/v1/admin/online-users?threshold=90", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        online_ids = [u["id"] for u in data["users"]]
        assert user.id not in online_ids


class TestUserManagement:
    def test_admin_lists_users(self, client, admin_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert data["total"] >= 1

    def test_admin_gets_single_user(self, client, admin_headers):
        resp = client.get("/api/v1/admin/users/1", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data
        assert "hashed_password" not in data

    def test_admin_deactivates_user(self, client, admin_headers, second_auth_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        users = resp.json()["items"]
        other = [u for u in users if u["email"] == "other@test.com"][0]
        resp = client.patch(
            f"/api/v1/admin/users/{other['id']}/status",
            headers=admin_headers,
            json={"is_active": False},
        )
        assert resp.status_code == 200
        assert resp.json()["is_active"] is False

    def test_admin_cannot_deactivate_self(self, client, admin_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        admin_user = [u for u in resp.json()["items"] if u["email"] == "admin@test.com"][0]
        resp = client.patch(
            f"/api/v1/admin/users/{admin_user['id']}/status",
            headers=admin_headers,
            json={"is_active": False},
        )
        assert resp.status_code == 400

    def test_admin_changes_role(self, client, admin_headers, second_auth_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        users = resp.json()["items"]
        other = [u for u in users if u["email"] == "other@test.com"][0]
        resp = client.patch(
            f"/api/v1/admin/users/{other['id']}/role",
            headers=admin_headers,
            json={"role": "admin"},
        )
        assert resp.status_code == 200
        assert resp.json()["role"] == "admin"

    def test_admin_cannot_remove_own_admin_role(self, client, admin_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        admin_user = [u for u in resp.json()["items"] if u["email"] == "admin@test.com"][0]
        resp = client.patch(
            f"/api/v1/admin/users/{admin_user['id']}/role",
            headers=admin_headers,
            json={"role": "user"},
        )
        assert resp.status_code == 400


class TestReports:
    def _create_report(self, client, auth_headers):
        resp = client.post(
            "/api/v1/support/",
            headers=auth_headers,
            json={
                "category": "other",
                "subject": "Test report for admin",
                "description": "This is a test report description for admin module testing.",
            },
        )
        return resp.json()["id"]

    def test_user_creates_report(self, client, auth_headers):
        resp = client.post(
            "/api/v1/support/",
            headers=auth_headers,
            json={
                "category": "other",
                "subject": "User report",
                "description": "User creates a report for testing.",
            },
        )
        assert resp.status_code == 201

    def test_admin_lists_reports(self, client, admin_headers, auth_headers):
        self._create_report(client, auth_headers)
        resp = client.get("/api/v1/admin/reports", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert data["total"] >= 1

    def test_admin_gets_single_report(self, client, admin_headers, auth_headers):
        report_id = self._create_report(client, auth_headers)
        resp = client.get(f"/api/v1/admin/reports/{report_id}", headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == report_id

    def test_admin_changes_report_status(self, client, admin_headers, auth_headers):
        report_id = self._create_report(client, auth_headers)
        resp = client.patch(
            f"/api/v1/admin/reports/{report_id}/status",
            headers=admin_headers,
            json={"status": "in_review"},
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "in_review"

    def test_admin_replies_to_report(self, client, admin_headers, auth_headers):
        report_id = self._create_report(client, auth_headers)
        resp = client.post(
            f"/api/v1/admin/reports/{report_id}/reply",
            headers=admin_headers,
            json={"message": "Resolvimos tu inconveniente."},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["email_sent"] is False
        assert data["report"]["admin_response"] == "Resolvimos tu inconveniente."
        assert data["report"]["status"] == "resolved"

    @patch("api.routes.admin_reports.send_admin_reply_email", return_value=True)
    def test_reply_sends_email_when_smtp_works(self, mock_email, client, admin_headers, auth_headers):
        report_id = self._create_report(client, auth_headers)
        resp = client.post(
            f"/api/v1/admin/reports/{report_id}/reply",
            headers=admin_headers,
            json={"message": "Tu reporte fue resuelto."},
        )
        assert resp.status_code == 200
        assert resp.json()["email_sent"] is True
        mock_email.assert_called_once()


class TestTools:
    def test_test_notification(self, client, admin_headers):
        resp = client.post(
            "/api/v1/admin/tools/test-notification",
            headers=admin_headers,
            json={"type": "simple"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert "notification_id" in data

    def test_test_email(self, client, admin_headers):
        resp = client.post(
            "/api/v1/admin/tools/test-email",
            headers=admin_headers,
            json={},
        )
        assert resp.status_code == 200

    def test_health_check(self, client, admin_headers):
        resp = client.get("/api/v1/admin/tools/health", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["healthy"] is True
        assert data["database"]["status"] == "ok"
        assert data["database"]["connected"] is True
        assert "email_service" in data
        assert "server_time" in data
        assert "secret" not in str(data).lower()
        assert "password" not in str(data).lower()

    def test_scanner_health(self, client, admin_headers):
        resp = client.get("/api/v1/admin/tools/scanner-health", headers=admin_headers)
        assert resp.status_code == 200
        assert "configured" in resp.json()

    def test_normal_user_cannot_use_tools(self, client, auth_headers):
        resp = client.get("/api/v1/admin/tools/health", headers=auth_headers)
        assert resp.status_code == 403


class TestActivityLog:
    def test_activity_log_records_admin_actions(self, client, admin_headers, auth_headers):
        resp = client.get("/api/v1/admin/users", headers=admin_headers)
        users = resp.json()["items"]
        other = [u for u in users if u["email"] == "other@test.com"]
        if other:
            client.patch(
                f"/api/v1/admin/users/{other[0]['id']}/status",
                headers=admin_headers,
                json={"is_active": False},
            )
        resp = client.get("/api/v1/admin/activity", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
