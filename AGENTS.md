# Spendly

Monorepo with two independent packages: `front-end/` (Expo/React Native) and `back-end/` (Python/FastAPI).

## Front-end (`front-end/`)

Expo SDK 54 · React Native 0.81.5 · React 19.1 · JavaScript (no TypeScript)

```sh
npm start        # Expo dev server
npm run web      # web target
npm run ios      # iOS simulator
npm run android  # Android emulator
```

- Entry: `index.js` → `registerRootComponent(App)` → `App.js` (native-stack navigator)
- Screens in `src/screens/`, each is a self-contained JS file with inline `StyleSheet`
- Navigation: `@react-navigation/native-stack`, `headerShown: false`, imperative `navigation.navigate()` (no Expo Router)
- No lint, typecheck, formatter, or test infrastructure
- UI language: Spanish; dark fintech palette (accent `#4ADE80`, bg `#0D0F14`)
- Color constants are duplicated across every screen — **extract shared constants to a module instead of adding a third copy**
- Backend calls are simulated (`setTimeout` stubs); no real API integration yet
- Package manager: **npm** (lockfile: `package-lock.json`)

## Back-end (`back-end/`)

Python 3 · FastAPI · SQLAlchemy · MariaDB (via Docker Compose) with SQLite fallback

```sh
cd back-end/
python -m venv .venv && source .venv/bin/activate  # first time only
pip install -r requirements.txt
# Start MariaDB (optional — falls back to SQLite if not running):
docker compose up -d
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Entry: `main.py` creates FastAPI app, calls `Base.metadata.create_all()` on startup
- API routes under `/api/v1/auth/`, `/api/v1/income/`, `/api/v1/expense/`
- Auth: JWT (HS256, 60 min expiry), bcrypt password hashing, OAuth2PasswordBearer
- Most endpoints require `get_current_user` dependency (Bearer token)
- No test, lint, or format infrastructure
- DB: reads `DATABASE_URL` from `.env`; defaults to `sqlite:///./gastos_app.db` if unset
- `.env` file (already present, tracked) with `DATABASE_URL`, `HOST`, `PORT`

## Notes

- `CLAUDE.md` references `AGENTS.md` via `@AGENTS.md`.
