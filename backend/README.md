# PrepVerse Backend (Java + Spring Boot + MySQL)

REST API for PrepVerse — placement preparation platform.
**Java 21 · Spring Boot 3 · Spring Security (JWT) · Spring Data JPA · MySQL 8 · Maven**

## Quick start

### Option A — Docker (easiest, no installs except Docker)

```bash
cd backend
docker compose up --build
```

Backend → http://localhost:8080 · MySQL → localhost:3306 (user `root`, password `root`)

### Option B — Manual

Prerequisites: **JDK 21+**, **Maven 3.8+**, **MySQL 8** running locally.

```bash
cd backend

# 1. Point to your MySQL (DB auto-created on first run).
#    Default: root / root @ localhost:3306. Override if needed:
export MYSQL_PASSWORD=your-mysql-root-password   # Windows: set MYSQL_PASSWORD=...

# 2. (Optional) Live AI answers instead of demo responses:
export GEMINI_API_KEY=your-gemini-key

# 3. Run
mvn spring-boot:run
```

Verify: http://localhost:8080/api/health

## Demo accounts (auto-seeded on first run)

| Email                  | Password    | Notes                                  |
|------------------------|-------------|----------------------------------------|
| `demo@prepverse.com`   | `demo1234`  | One-click demo login in the UI         |
| `surya@dtu.ac.in`      | `password123` | Matches the prefilled login form     |
| any registered email   | your choice | Register from the UI                   |

Leaderboard seed users (`password123`): `aarav@iitd.ac.in`, `ananya@iitb.ac.in`,
`rohan@bits.ac.in`, `sneha@dtu.ac.in`, `vikram@nsut.ac.in`.

## API reference

Base URL: `http://localhost:8080`
Interactive docs (Swagger UI): http://localhost:8080/swagger-ui.html

| Method | Endpoint                | Auth   | Description                                              |
|--------|-------------------------|--------|----------------------------------------------------------|
| GET    | `/api/health`           | public | Health check                                             |
| POST   | `/api/auth/register`    | public | Register student → `{ token, user }`                     |
| POST   | `/api/auth/login`       | public | Login → `{ token, user }`                                |
| POST   | `/api/auth/demo`        | public | Demo login → `{ token, user }`                           |
| GET    | `/api/users/me`         | JWT    | Current profile                                          |
| PUT    | `/api/users/me`         | JWT    | Update profile                                           |
| GET    | `/api/problems/solved`  | JWT    | Solved problem ids `string[]`                            |
| POST   | `/api/problems/solved`  | JWT    | Mark solved (bumps score/XP) → updated user              |
| GET    | `/api/submissions/mine` | JWT    | My submissions (newest first)                            |
| POST   | `/api/submissions`      | JWT    | Save a submission                                        |
| GET    | `/api/test-attempts`    | JWT    | My mock-test attempts                                    |
| POST   | `/api/test-attempts`    | JWT    | Save a mock-test attempt                                 |
| GET    | `/api/leaderboard`      | public | Top 20 by PrepVerse score (live from MySQL)              |
| POST   | `/api/compiler/run`     | JWT    | **Real** code execution (`language`, `code`, `customInput`) |
| POST   | `/api/ai-mentor`        | JWT    | AI mentor (`prompt`, `history`, `systemInstruction`)     |

JWT usage: `Authorization: Bearer <token>` (paste it into Swagger's Authorize button too).

### Example

```bash
TOKEN=$(curl -s -X POST localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@prepverse.com","password":"demo1234"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Run Python code for real (authenticated)
curl -X POST localhost:8080/api/compiler/run \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"language":"python","code":"print(sum([1,2,3,4,5]))"}'
```

## Security

- **JWT (HS256)** — stateless auth; passwords hashed with BCrypt. Only
  `/api/auth/**`, `/api/health`, `/api/leaderboard` and Swagger docs are public.
- **AI + compiler require login** — these endpoints cost external quota, so
  anonymous calls get `401`. The React client attaches the JWT automatically
  and bounces to login when it expires.
- **Rate limiting** (sliding window, `RateLimitFilter`) — excess calls get `429`:

  | Endpoint            | Limit              | Protects against        |
  |---------------------|--------------------|-------------------------|
  | `/api/auth/**`      | 10 req/min per IP  | login brute-forcing     |
  | `/api/ai-mentor`    | 20 req/min per user| Gemini quota draining   |
  | `/api/compiler/**`  | 30 req/min per user| Piston abuse            |

- **CORS** — origins configurable via `CORS_ALLOWED_ORIGINS`
  (default `*` for development; restrict in production).
- **Validation** — all write endpoints use Bean Validation (`400` with field details).

## How it works

- **Java 21 + records** — DTOs are Java records; request handling runs on
  **virtual threads** (`spring.threads.virtual.enabled=true`), so blocking
  Piston/Gemini/MySQL calls scale to many concurrent users.
- **Auth** — Spring Security, stateless JWT (HS256). Passwords hashed with BCrypt.
  `JwtAuthFilter` validates the token on every request.
- **Database** — Spring Data JPA + Hibernate, `ddl-auto=update` creates tables
  automatically (`users`, `user_solved_problems`, `submissions`,
  `test_attempts`, `test_attempt_topics`). Reference DDL: `db/schema.sql`.
- **Code execution** — Real runs via the free [Piston API](https://emkc.org)
  (no key needed, 20 languages). Falls back to mock simulation if unreachable.
- **AI Mentor** — Google Gemini 2.5 Flash via REST. Without `GEMINI_API_KEY`
  it returns structured demo answers.
- **Content catalogue** (problems, aptitude, companies, notes) is intentionally
  bundled with the React client as static data — it never lived in the old
  backend either. All **dynamic/user data** lives in MySQL behind this API.

## Project structure

```
backend/
├── pom.xml                          # Maven build (Spring Boot 3.2, Java 21)
├── Dockerfile + docker-compose.yml  # backend + MySQL 8
├── db/schema.sql                    # MySQL DDL reference
└── src/main/java/com/prepverse/
    ├── PrepverseApplication.java    # entry point
    ├── config/        # Security, CORS, RestClient, OpenAPI/Swagger
    ├── security/      # JwtUtil, JwtAuthFilter, RateLimitFilter, UserDetailsService
    ├── entity/        # User, Submission, TestAttempt (JPA)
    ├── repository/    # Spring Data JPA repositories
    ├── dto/           # Request/response records
    ├── service/       # Business logic (auth, compiler, AI, ...)
    ├── controller/    # REST endpoints (/api/...)
    ├── exception/     # Global JSON error handler
    └── seed/          # Demo + leaderboard seed data
```

## Configuration

| Variable / property              | Default                        | Purpose                        |
|----------------------------------|--------------------------------|--------------------------------|
| `SPRING_DATASOURCE_URL`          | `jdbc:mysql://localhost:3306/prepverse?...` | JDBC URL (docker overrides) |
| `MYSQL_PASSWORD`                 | `root`                         | MySQL root password            |
| `GEMINI_API_KEY`                 | _(empty = demo mode)_          | Live AI mentor answers         |
| `JWT_SECRET`                     | dev secret                     | JWT signing key (min 32 chars) |
| `CORS_ALLOWED_ORIGINS`           | `*`                            | Comma-separated allowed origins|
| `app.piston.base-url`            | `https://emkc.org/api/v2/piston` | Code execution API           |

## Online judge & admin API

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/problems` | JWT | Full bank (ordered, no hidden cases) |
| GET | `/api/problems/{id}` | JWT | One problem (no hidden cases) |
| POST | `/api/problems/{id}/submit` | JWT, 10/min | Judged submit; verdicts: Accepted, Wrong Answer, Time Limit Exceeded, Compilation Error, Runtime Error, Judge Error |
| GET | `/api/admin/stats` | ROLE_ADMIN | Users/problems/submissions/attempts counts |
| GET | `/api/admin/users` | ROLE_ADMIN | All students |
| PUT | `/api/admin/users/{id}/role` | ROLE_ADMIN | `{"role":"student"\|"admin"}` (no self-demote) |
| GET/POST | `/api/admin/problems` | ROLE_ADMIN | List / create (with test cases) |
| GET/PUT/DELETE | `/api/admin/problems/{id}` | ROLE_ADMIN | Detail (with cases) / replace / delete |

Output comparison is lenient: CRLF normalized, per-line trailing
whitespace and edge blank lines ignored. Seeded bank: 10 curated +
40 generated = 50 problems with visible + hidden cases (`ProblemSeeder`,
runs once when the `problems` table is empty).

## Session & refresh tokens

Access JWTs live 15 minutes (`app.jwt.expiration-ms`). Every login /
register / demo response also carries an opaque, single-use refresh
token (30 days, SHA-256 hash stored in `refresh_tokens`).

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/refresh` | refresh body | Rotates the pair; reuse of a revoked token wipes the whole family (theft protection) |
| POST | `/api/auth/logout` | JWT | Revokes all refresh tokens of the user |

The React client retries once after a silent refresh on 401 and only
bounces to login when the session is truly dead. No-token 401s never
wipe local (offline demo) sessions.

## Personal data, streaks & analytics

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET/PUT | `/api/resume` | JWT | Resume builder JSON (204 when never saved, 128 KB cap) |
| GET/PUT | `/api/study-plan` | JWT | Study-plan config + checklist JSON |
| GET | `/api/analytics/summary` | JWT | Totals, accuracy, mock average, streak, 14-day activity, topic accuracy |

Streaks are computed from `user_activity` (one row per active day,
written on Accepted submissions and mock attempts). `PUT /api/users/me`
also accepts `theme: "dark" | "light"`.

## Actuator & logging

| Endpoint | Auth | Notes |
|----------|------|-------|
| `/actuator/health`, `/actuator/info` | public | Liveness + app info (health details need a JWT) |
| `/actuator/metrics` | ROLE_ADMIN | JVM, HTTP, Hikari gauges |
| `/actuator/httpexchanges` | ROLE_ADMIN | Last 100 requests/responses |

Logs go to stdout and `logs/prepverse.log` (daily rotation, 14 days,
500 MB cap; override dir with `LOG_DIR`). Production profile
(`-Dspring.profiles.active=prod`) quiets framework logs to WARN.
