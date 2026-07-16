class TestCreateReport:
    def test_create_report(self, client, auth_headers):
        resp = client.post("/api/v1/support/", json={
            "category": "transactions",
            "subject": "No puedo eliminar transacciones",
            "description": "Cuando intento eliminar una transacción, no sucede nada.",
        }, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["subject"] == "No puedo eliminar transacciones"
        assert data["status"] == "open"
        assert "id" in data


class TestListReports:
    def test_list_my_reports(self, client, auth_headers):
        client.post("/api/v1/support/", json={
            "category": "authentication",
            "subject": "No puedo iniciar sesión",
            "description": "El login falla siempre con credenciales correctas.",
        }, headers=auth_headers)
        resp = client.get("/api/v1/support/me", headers=auth_headers)
        assert resp.status_code == 200
        assert len(resp.json()) == 1


class TestGetReport:
    def test_get_report_by_id(self, client, auth_headers):
        create = client.post("/api/v1/support/", json={
            "category": "scan",
            "subject": "Escaneo no funciona",
            "description": "La cámara no detecta el comprobante.",
        }, headers=auth_headers)
        rid = create.json()["id"]
        resp = client.get(f"/api/v1/support/{rid}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["id"] == rid

    def test_get_other_user_report(self, client, auth_headers, second_auth_headers):
        create = client.post("/api/v1/support/", json={
            "category": "other",
            "subject": "Reporte privado",
            "description": "Este reporte es solo mío y no debería poder verlo otro usuario.",
        }, headers=auth_headers)
        rid = create.json()["id"]
        resp = client.get(f"/api/v1/support/{rid}", headers=second_auth_headers)
        assert resp.status_code == 403
