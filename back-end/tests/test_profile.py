class TestUpdateProfile:
    def test_update_profile_name(self, client, auth_headers):
        resp = client.patch("/api/v1/profile", json={
            "full_name": "Nuevo Nombre",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["full_name"] == "Nuevo Nombre"

    def test_update_profile_currency(self, client, auth_headers):
        resp = client.patch("/api/v1/profile", json={
            "preferred_currency": "USD",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["preferred_currency"] == "USD"

    def test_update_profile_no_auth(self, client):
        resp = client.patch("/api/v1/profile", json={
            "full_name": "Hacker",
        })
        assert resp.status_code == 401


class TestChangePassword:
    def test_change_password_correct(self, client, auth_headers):
        resp = client.patch("/api/v1/profile/password", json={
            "current_password": "Test1234!",
            "new_password": "NewPass5678!",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert "actualizada" in resp.json()["message"]

    def test_change_password_wrong_current(self, client, auth_headers):
        resp = client.patch("/api/v1/profile/password", json={
            "current_password": "WrongPass!",
            "new_password": "NewPass5678!",
        }, headers=auth_headers)
        assert resp.status_code == 401


class TestSessions:
    def test_list_sessions(self, client, auth_headers):
        resp = client.get("/api/v1/profile/sessions", headers=auth_headers)
        assert resp.status_code == 200
        sessions = resp.json()
        assert len(sessions) >= 1
        assert sessions[0]["is_current"] is True

    def test_revoke_all_sessions(self, client, auth_headers):
        import json
        resp = client.request(
            "DELETE",
            "/api/v1/profile/sessions",
            content=json.dumps({"current_password": "Test1234!"}),
            headers={**auth_headers, "Content-Type": "application/json"},
        )
        assert resp.status_code == 200
