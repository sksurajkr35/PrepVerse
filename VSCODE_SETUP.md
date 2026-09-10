# Run PrepVerse in VS Code

## What's in this folder

```
PrepVerse/
├── .vscode/            # Recommended extensions + one-click Run Tasks
├── backend/            # Java 21 Spring Boot API + MySQL (Maven)
│   ├── src/main/...    # config, controller, service, entity, dto, ...
│   ├── src/test/...    # 39 JUnit + MockMvc tests (no DB needed)
│   ├── db/schema.sql   # MySQL DDL reference (16 tables)
│   └── docker-compose.yml  # MySQL + backend + frontend in one command
├── prepverse/          # React 19 + TypeScript + Vite frontend
├── docs/               # Project report, viva Q&A, demo script
├── .github/workflows/  # CI (Maven verify + tsc + Vite build)
├── DEPLOY.md           # Production deployment guide
└── VSCODE_SETUP.md     # This file
```

## Prerequisites

| Need      | Easiest option | Native-run option |
|-----------|----------------|-------------------|
| Docker    | Docker Desktop (covers MySQL + Java + build) | — |
| Java      | — | JDK 21 (Temurin: https://adoptium.net) |
| Build     | — | Maven 3.8+ (https://maven.apache.org) |
| Database  | — | MySQL 8, root user (https://dev.mysql.com) |
| Frontend  | Node.js 20 LTS for local dev (https://nodejs.org) | Same |
| Editor    | VS Code (https://code.visualstudio.com) | Same |

> **First time? Use Path A (Docker).** You only install Docker Desktop +
> Node (optional) and everything else comes from containers.

## Step 1 — Open the folder

1. Unzip `PrepVerse-vscode.zip` anywhere (e.g. `Documents/PrepVerse`).
2. VS Code → **File → Open Folder** → select it.
3. When prompted **"Do you want to install the recommended extensions?"**,
   click **Install All** (Java Pack, Spring Boot, ESLint, Prettier, Tailwind).

## Step 2 — Environment files (30 seconds)

```bash
cp backend/.env.example backend/.env
cp prepverse/.env.example prepverse/.env
```

Defaults work out of the box for local runs. For a refresher on each
variable, see the comments inside the `.example` files.

## Step 3 — Run it

### Path A — Docker (recommended)

1. Start Docker Desktop.
2. VS Code → **Terminal → Run Task** → **Docker: Full Stack Up**.
3. Wait for `Started PrepverseApplication` in the terminal, then open
   **http://localhost:5173**.

That's MySQL + backend + frontend with one task. Stop with the
**Docker: Stop** task.

### Path B — Native (no Docker)

1. Start MySQL 8 locally with user `root` / password `root`
   (or set your password in `backend/.env` as `MYSQL_PASSWORD=...` —
   the database `prepverse` is created automatically on first boot).
2. **Terminal → Run Task** → **Frontend: Install + Type-check** (one time).
3. **Terminal → Run Task** → **Full Stack: Backend + Frontend**.
4. Open **http://localhost:5173**.

First boot downloads Maven/Node dependencies and seeds the database
(50 problems + 160 test cases, 129 content rows, demo users) — give it
2–5 minutes, then it's fast.

## Log in and try

| Who | Email | Password |
|-----|-------|----------|
| Student (demo) | `demo@prepverse.com` | `demo1234` |
| Admin portal | `admin@prepverse.com` | `admin123` |

Or click **Instant Guest Demo Access**, or register a new account.

| Page | URL |
|------|-----|
| App | http://localhost:5173 |
| API docs (Swagger) | http://localhost:8080/swagger-ui.html |
| Health check | http://localhost:8080/api/health |

**2-minute smoke test:** log in → DSA page → open *Two Sum* → Run, then
Submit a correct solution → see **Accepted** and +5 score.

## Useful tasks & commands

| Task (Terminal → Run Task) | What it does |
|---|---|
| Full Stack: Backend + Frontend | Runs API (:8080) + Vite (:5173) side by side |
| Backend: Build + Test | `mvn verify` — compiles + runs all 39 tests |
| Frontend: Install + Type-check | `npm install` + `tsc --noEmit` |
| Docker: Full Stack Up / Stop | Compose stack on :5173 (app) + :8080 (API) |

## Troubleshooting

| Symptom | Fix |
|---|---|
| `mvn: command not found` | Install Maven 3.8+ and restart VS Code, or use Path A (Docker) |
| `JAVA_HOME` / "release 21 not supported" | Install JDK 21 and set `JAVA_HOME` to it |
| Backend exits: *Communications link failure* | MySQL isn't running, or `MYSQL_PASSWORD` in `backend/.env` is wrong |
| Port 8080/5173/3306 already in use | Stop the other program, or `docker compose down` first |
| Frontend shows mock/offline data | Backend isn't up — check http://localhost:8080/api/health |
| First submit is slow | Normal — Piston cold start; retry, it won't double-score |
| CORS errors (split hosting only) | Set `CORS_ALLOWED_ORIGINS` to your exact frontend origin |

## Where to look in the code

- Judging engine: `backend/.../service/JudgingService.java`
- Auth + refresh tokens: `backend/.../service/AuthService.java`,
  `RefreshTokenService.java`
- API routes: `backend/.../controller/` (one file per area)
- Seed data: `backend/.../seed/` + `backend/src/main/resources/content/`
- React pages: `prepverse/src/pages/` · API client: `prepverse/src/services/api.ts`
