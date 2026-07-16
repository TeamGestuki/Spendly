class TestCreateGoal:
    def test_create_goal(self, client, auth_headers):
        resp = client.post("/api/v1/goals/", json={
            "name": "Vacaciones",
            "target_amount": 500000,
            "category": "travel",
        }, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Vacaciones"
        assert data["target_amount"] == 500000
        assert data["current_amount"] == 0
        assert data["status"] == "active"


class TestListGoals:
    def test_list_goals(self, client, auth_headers):
        client.post("/api/v1/goals/", json={
            "name": "Goal 1",
            "target_amount": 10000,
        }, headers=auth_headers)
        client.post("/api/v1/goals/", json={
            "name": "Goal 2",
            "target_amount": 20000,
        }, headers=auth_headers)
        resp = client.get("/api/v1/goals/", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_list_only_own_goals(self, client, auth_headers, second_auth_headers):
        client.post("/api/v1/goals/", json={
            "name": "My Goal",
            "target_amount": 10000,
        }, headers=auth_headers)
        client.post("/api/v1/goals/", json={
            "name": "Other Goal",
            "target_amount": 20000,
        }, headers=second_auth_headers)
        resp = client.get("/api/v1/goals/", headers=auth_headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["name"] == "My Goal"


class TestUpdateGoal:
    def test_update_goal(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Old Name",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        resp = client.patch(f"/api/v1/goals/{gid}", json={
            "name": "New Name",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["name"] == "New Name"


class TestDeleteGoal:
    def test_delete_goal(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "To Delete",
            "target_amount": 50000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        resp = client.delete(f"/api/v1/goals/{gid}", headers=auth_headers)
        assert resp.status_code == 204
        list_resp = client.get("/api/v1/goals/", headers=auth_headers)
        assert len(list_resp.json()) == 0


class TestGoalContributions:
    def test_add_contribution(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Ahorro",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        resp = client.post(f"/api/v1/goals/{gid}/contributions", json={
            "amount": 25000,
            "type": "aporte",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["current_amount"] == 25000

    def test_add_withdrawal(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Fondo",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        client.post(f"/api/v1/goals/{gid}/contributions", json={
            "amount": 50000,
            "type": "aporte",
        }, headers=auth_headers)
        resp = client.post(f"/api/v1/goals/{gid}/contributions", json={
            "amount": 10000,
            "type": "retiro",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["current_amount"] == 40000

    def test_withdrawal_exceeds_balance(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Poor Fund",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        client.post(f"/api/v1/goals/{gid}/contributions", json={
            "amount": 5000,
            "type": "aporte",
        }, headers=auth_headers)
        resp = client.post(f"/api/v1/goals/{gid}/contributions", json={
            "amount": 10000,
            "type": "retiro",
        }, headers=auth_headers)
        assert resp.status_code == 400


class TestGoalStatus:
    def test_pause_and_resume(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Pausable",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        resp = client.patch(f"/api/v1/goals/{gid}/pause", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "paused"
        resp = client.patch(f"/api/v1/goals/{gid}/resume", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "active"

    def test_cancel_goal(self, client, auth_headers):
        create = client.post("/api/v1/goals/", json={
            "name": "Cancellable",
            "target_amount": 100000,
        }, headers=auth_headers)
        gid = create.json()["id"]
        resp = client.patch(f"/api/v1/goals/{gid}/cancel", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "cancelled"
