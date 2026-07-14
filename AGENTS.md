# Spendly — AGENTS.md

## Setup (back-end)

```sh
python -m venv .venv && source .venv/bin/activate
pip install -r back-end/requirements.txt
docker compose -f back-end/compose.yml up -d
uvicorn back-end/main:app --reload --host 0.0.0.0 --port 8000
```

## Critical Architecture Quirks

- load_dotenv(override=True) in core/database.py line 6 - fragile import-order dependency
- SQLite fallback if DATABASE_URL unset (back-end/.env example only)
- bcrypt==4.0.1 pinned for passlib compatibility
- No __init__.py files - implicit namespace packages

## Auth & Token Flow

- Login: application/x-www-form-urlencoded, username=email, form with device_name/remember_me
- LoginForm class in auth.py:40 - extends OAuth2PasswordRequestForm
- JWT claims: sub=email, sid=session.id, default 7 days, 30 days with remember_me=true
- Session tracking: user_sessions table updated on /me calls

## API Routes

- Auth (/api/v1/auth)
- Transactions (/api/v1/transactions) 
- Profile (/api/v1/profile)
- Scan (/api/v1/scan) - CRITICAL: scan.py:117 bug
- Goals (/api/v1/goals)
- Support (/api/v1/support) - reports system

## Scan Route Bug

scan.py:117: id_usuario = current_user (User object) instead of user.id breaks Transaction ownership. Use db.query(User).filter(User.email == ...).first().id to get user ID.

## Env Vars

Required: SECRET_KEY, GOOGLE_API_KEY (scan route needs this!)
.back-end/.env.example only lists SECRET_KEY - missing GOOGLE_API_KEY

## Avatar Uploads

- Max size: 5MB (jpg/jpeg/png/webp)
- Stored: back-end/uploads/avatars/ (auto-created)
- Static mount: /uploads (main.py:19)

## Front-end Setup

```sh
cd front-end
npx expo start           # Expo Go
npx expo start --web     # web
```

- Auth token: AsyncStorage "access_token"
- PIN locks after 5 failed attempts (60 min lockout)
- API endpoints hardcoded: authService.js, transactionService.js, HomeScreen.js, ProfileScreen.js
- No TypeScript, COLORS duplicated in all screens

## Support Reports API

Feature: User support ticketing system with email notifications

Endpoint | Method | Requires JWT | Description
---------|--------|--------------|------------
`/api/v1/support/` | POST | Yes | Create new support report
`/api/v1/support/me` | GET | Yes | Get current user's reports (with status/limit/offset filters)
`/api/v1/support/{id}` | GET | Yes | Get specific report (admin can view any, users see own only)
`/api/v1/support/{id}` | PATCH | Yes | Update report (admin only)

**Created endpoints:**
- `back-end/models/support_report.py` - Database model with relationship to User
- `back-end/schemas/support_report.py` - Pydantic schemas with category/status enums
- `back-end/api/routes/support.py` - Complete FastAPI router with email notifications
