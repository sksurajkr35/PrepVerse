# Run PrepVerse on Your Local Computer

Everything you need, in order. Pick **Option A** (Docker — easiest) or
**Option B** (install the tools yourself).

---

## What's in this package

```
PrepVerse/
├── backend/     Spring Boot 3.2.5 API  (Java 21, Maven, MySQL 8)
├── prepverse/   React 19 web app       (TypeScript, Vite 6, Tailwind 4)
├── docs/        Report, demo script, viva Q&A, structure map
├── README.md    Project overview
├── DEPLOY.md    Production deployment
└── VSCODE_SETUP.md   Editor + one-click tasks
```

**179 source files.** Build output (`node_modules/`, `target/`, `dist/`) is
intentionally **not** included — you regenerate it with the commands below.

## What you need installed

| Tool | Version | Needed for |
|---|---|---|
| Node.js | 18+ (22 tested) | Frontend |
| JDK | 21+ | Backend |
| Maven | 3.8+ | Backend |
| MySQL | 8.x | Database — **or** let Docker provide it |
| Docker + Compose | any recent | Option A only |

---

## Option A — Docker (recommended)

Requires only **Docker Desktop** (or Docker Engine + Compose). No JDK, no
Maven, no MySQL install.

```bash
cd backend
docker compose up --build
```

That starts all three services:

| Service | Container | URL |
|---|---|---|
| MySQL 8 | `prepverse-mysql` | `localhost:3306` (root / root) |
| Spring Boot API | `prepverse-backend` | http://localhost:8080 |
| React app | `prepverse-frontend` | http://localhost:5173 |

First build pulls the MySQL 8 and Maven base images, so allow a few minutes.
Database, tables, and seed data are created automatically — no manual import.

Open **http://localhost:5173**.

To stop: `Ctrl+C`, then `docker compose down` (add `-v` to also wipe the data volume).

---

## Option B — Run natively

### B1. Backend

```bash
cd backend

# Point it at your MySQL root password
export MYSQL_PASSWORD=<your-mysql-password>     # Windows PowerShell: $env:MYSQL_PASSWORD="..."
                                                # Windows cmd:        set MYSQL_PASSWORD=...

# Optional — enables live AI mentor replies instead of built-in fallbacks
export GEMINI_API_KEY=<your-key>                # optional

mvn spring-boot:run
```

Backend starts on **http://localhost:8080**.

You only need MySQL running — the database `prepverse`, all tables, and the
seed content are created on first boot (`createDatabaseIfNotExist=true` +
`ddl-auto=update`). If MySQL is on a non-default host/port, override
`SPRING_DATASOURCE_URL` too.

Check it's alive:

```bash
curl http://localhost:8080/api/health
```

### B2. Frontend

In a **second terminal**:

```bash
cd prepverse
npm install
npm run dev
```

App runs on **http://localhost:5173**. Vite proxies every `/api/*` call to
`http://localhost:8080`, so no CORS or base-URL configuration is needed in dev.

If your backend is somewhere else:

```bash
JAVA_API_URL=http://localhost:9090 npm run dev
```

### B3. Log in

Open http://localhost:5173 and click **Start Preparing Free → Instant Guest
Demo Access**, or use a seeded account:

| Email | Password | Role |
|---|---|---|
| `demo@prepverse.com` | `demo1234` | Demo student |
| `surya@dtu.ac.in` | `password123` | Regular user |
| `aarav@iitd.ac.in` | `password123` | Leaderboard seed |
| `ananya@iitb.ac.in` | `password123` | Leaderboard seed |
| `rohan@bits.ac.in` | `password123` | Leaderboard seed |
| `sneha@dtu.ac.in` | `password123` | Leaderboard seed |
| `vikram@nsut.ac.in` | `password123` | Leaderboard seed |

Or register a new account from the login modal.

---

## Configuration reference

Copy `.env.example` → `.env` in each folder, or export the variables directly.

**`backend/`**

| Variable | Default | Notes |
|---|---|---|
| `MYSQL_USER` | `root` | |
| `MYSQL_PASSWORD` | `root` | Must match your MySQL |
| `JWT_SECRET` | dev placeholder | **Set in production** — min 32 chars for HS256. `openssl rand -hex 32` |
| `GEMINI_API_KEY` | *(empty)* | Empty = built-in fallback replies; no key needed to run |
| `CORS_ALLOWED_ORIGINS` | `*` | Comma-separated, no trailing slash |

**`prepverse/`**

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_URL` | *(empty)* | Empty = same-origin `/api` via proxy. Set only for split deploys |

No external API key is required to run the app. Piston (code execution) is a
free keyless API and falls back to simulated results if unreachable; Gemini is
optional.

---

## Useful commands

```bash
# Frontend
cd prepverse
npm run dev       # dev server + HMR      -> :5173
npm run build     # production bundle     -> dist/
npm run preview   # serve the built app   -> :4173
npm run lint      # TypeScript typecheck (tsc --noEmit)

# Backend
cd backend
mvn spring-boot:run          # run the API
mvn test                     # run the test suite
mvn clean package            # build the jar -> target/
docker compose up --build    # full stack
```

---

## Troubleshooting

**`npm install` fails / hangs** — Node must be 18+. Check `node -v`. Delete
`node_modules` and `package-lock.json`, then reinstall.

**Backend won't start, `Communications link failure`** — MySQL isn't running,
or `MYSQL_PASSWORD` is wrong. Start MySQL and confirm you can log in:
`mysql -u root -p`.

**`Access denied for user 'root'`** — password mismatch. Set `MYSQL_PASSWORD`
to your real MySQL root password.

**Port 8080 / 5173 / 3306 already in use** — change `server.port` in
`backend/src/main/resources/application.properties`, or the port mapping in
`backend/docker-compose.yml`.

**Frontend loads but shows no data** — the backend isn't reachable on `:8080`.
Check `curl http://localhost:8080/api/health`, and that you started Vite from
the `prepverse/` directory (the proxy config lives in `vite.config.ts`).

**AI mentor gives generic replies** — that's the built-in fallback. Set
`GEMINI_API_KEY` and restart the backend for live answers.

**Blank page in the browser** — open DevTools console. Usually the backend is
down, or you're hitting the built `dist/` without a server; use
`npm run dev` or `npm run preview`, not opening `index.html` directly.

---

## Verified in this package

The frontend was built and typechecked before packaging:

```
npm install   ->  137 packages, exit 0
npm run lint  ->  tsc --noEmit, 0 errors
npm run build ->  2294 modules transformed, dist/ written, exit 0
```

The backend was **not** compiled here (no JDK in the packaging environment).
It builds with JDK 21 + Maven 3.8+ per `backend/pom.xml`.
