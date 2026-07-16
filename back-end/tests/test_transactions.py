class TestCreateTransaction:
    def test_create_expense(self, client, auth_headers):
        resp = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "category": "food",
            "description": "Almuerzo",
            "date": "2026-07-16",
            "currency": "ARS",
        }, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["type"] == "expense"
        assert data["amount"] == 5000
        assert data["category"] == "food"
        assert "id" in data
        assert "owner_id" in data

    def test_create_income(self, client, auth_headers):
        resp = client.post("/api/v1/transactions/", json={
            "type": "income",
            "amount": 100000,
            "category": "salary",
            "description": "Sueldo",
            "date": "2026-07-16",
        }, headers=auth_headers)
        assert resp.status_code == 201
        assert resp.json()["type"] == "income"

    def test_create_with_payment_method(self, client, auth_headers):
        resp = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 3000,
            "date": "2026-07-16",
            "payment_method": "credit_card",
        }, headers=auth_headers)
        assert resp.status_code == 201
        assert resp.json()["payment_method"] == "credit_card"

    def test_create_invalid_payment_method(self, client, auth_headers):
        resp = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 3000,
            "date": "2026-07-16",
            "payment_method": "Mercado Pago",
        }, headers=auth_headers)
        assert resp.status_code == 422

    def test_create_no_auth(self, client):
        resp = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 1000,
            "date": "2026-07-16",
        })
        assert resp.status_code == 401


class TestListTransactions:
    def test_list_transactions(self, client, auth_headers):
        client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 1000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        client.post("/api/v1/transactions/", json={
            "type": "income",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        resp = client.get("/api/v1/transactions/", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_list_filter_by_type(self, client, auth_headers):
        client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 1000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        client.post("/api/v1/transactions/", json={
            "type": "income",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        resp = client.get("/api/v1/transactions/?type=expense", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) == 1
        assert resp.json()[0]["type"] == "expense"

    def test_list_only_own_transactions(self, client, auth_headers, second_auth_headers):
        client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 1000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 2000,
            "date": "2026-07-16",
        }, headers=second_auth_headers)
        resp = client.get("/api/v1/transactions/", headers=auth_headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["amount"] == 1000


class TestUpdateTransaction:
    def test_update_amount(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "amount": 9500,
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["amount"] == 9500

    def test_update_category(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "category": "services",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["category"] == "services"

    def test_update_payment_method(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "payment_method": "bank_account",
        }, headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["payment_method"] == "bank_account"

    def test_update_multiple_fields(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "amount": 7500,
            "description": "Internet",
            "category": "services",
            "payment_method": "debit_card",
        }, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["amount"] == 7500
        assert data["description"] == "Internet"
        assert data["category"] == "services"
        assert data["payment_method"] == "debit_card"

    def test_update_other_user_transaction(self, client, auth_headers, second_auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "amount": 1,
        }, headers=second_auth_headers)
        assert resp.status_code == 404

    def test_update_nonexistent(self, client, auth_headers):
        resp = client.patch("/api/v1/transactions/99999", json={
            "amount": 1,
        }, headers=auth_headers)
        assert resp.status_code == 404

    def test_update_amount_zero(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "amount": 0,
        }, headers=auth_headers)
        assert resp.status_code == 422

    def test_owner_id_never_changes(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        original_owner = create.json()["owner_id"]
        resp = client.patch(f"/api/v1/transactions/{tid}", json={
            "amount": 9999,
        }, headers=auth_headers)
        assert resp.json()["owner_id"] == original_owner


class TestDeleteTransaction:
    def test_delete_transaction(self, client, auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.delete(f"/api/v1/transactions/{tid}", headers=auth_headers)
        assert resp.status_code == 204
        list_resp = client.get("/api/v1/transactions/", headers=auth_headers)
        assert len(list_resp.json()) == 0

    def test_delete_other_user_transaction(self, client, auth_headers, second_auth_headers):
        create = client.post("/api/v1/transactions/", json={
            "type": "expense",
            "amount": 5000,
            "date": "2026-07-16",
        }, headers=auth_headers)
        tid = create.json()["id"]
        resp = client.delete(f"/api/v1/transactions/{tid}", headers=second_auth_headers)
        assert resp.status_code == 404
