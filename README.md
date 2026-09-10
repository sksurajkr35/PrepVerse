# PrepVerse — Learn. Practice. Compete. Get Placed.

Full-stack **Java** placement preparation platform for engineering students:
DSA practice with real code execution, aptitude, mock tests, company kits,
core CS notes, interview prep, AI mentor, leaderboard, analytics and more.

## Tech stack

| Layer      | Technology                                                                 |
|------------|----------------------------------------------------------------------------|
| Frontend   | React 19, TypeScript, Vite 6, Tailwind CSS 4 (`prepverse/`)                |
| Backend    | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA (`backend/`) |
| Database   | MySQL 8                                                                    |
| Build      | Maven (backend), npm (frontend)                                            |
| External   | Piston API (real code execution), Gemini 2.5 Flash (AI mentor)             |

```
Browser (React :5173) --/api/*--> Spring Boot (:8080) --> MySQL 8 (:3306)
                                         |--> Piston (code run)  |--> Gemini (AI)
```

## Run the whole project

### Fastest: backend with Docker + frontend with npm

```bash
# Terminal 1 - MySQL + Java backend
cd backend
docker compose up --build     # backend -> http://localhost:8080

# Terminal 2 - React frontend
cd prepverse
npm install
npm run dev                   # app -> http://localhost:5173
```

Open http://localhost:5173, click **Start Preparing Free → Instant Guest Demo Access**.

### Without Docker

1. Install JDK 21+, Maven 3.8+, MySQL 8, Node.js 18+.
2. Start MySQL, then:
   ```bash
   cd backend
   export MYSQL_PASSWORD=<your-mysql-root-password>   # Windows: set MYSQL_PASSWORD=...
   export GEMINI_API_KEY=<optional-for-live-AI>
   mvn spring-boot:run
   ```
3. In another terminal: `cd prepverse && npm install && npm run dev`.

Demo logins: `demo@prepverse.com / demo1234` ·
`surya@dtu.ac.in / password123` · or register a new account.

## Repository layout

```
PrepVerse/
├── backend/    # Java Spring Boot REST API + MySQL (see backend/README.md)
│   ├── src/main/java/com/prepverse/  # config, security, entity, dto,
│   │                                 # service, controller, seed ...
│   ├── db/schema.sql                 # MySQL DDL reference
│   └── docker-compose.yml            # one-command backend + MySQL
└── prepverse/  # React TypeScript frontend (see prepverse/README.md)
    └── src/    # pages, components, context, services, data
```

## API (backend on :8080)

Auth (`/api/auth/register|login|demo`), profile (`/api/users/me`),
progress (`/api/problems/solved`, `/api/submissions/mine`, `/api/test-attempts`),
`GET /api/leaderboard`, `POST /api/compiler/run` (real execution),
`POST /api/ai-mentor`, `GET /api/health`. Full table in `backend/README.md`.

## Online judge (real judging + admin portal)

- `GET /api/problems` — 50-problem bank from MySQL (JWT);
  `GET /api/problems/{id}` — one problem (never includes hidden cases).
- `POST /api/problems/{id}/submit` (JWT, 10/min) — runs the code against
  **every** test case via Piston and returns an honest verdict: `Accepted`,
  `Wrong Answer`, `Time Limit Exceeded`, `Compilation Error`,
  `Runtime Error`, or `Judge Error` (judge down — nothing is saved/scored).
  On `Accepted` the server saves the submission, marks the problem solved,
  and bumps score/XP.
- Hidden test case input/output is never sent to the browser — on failure
  you only see which case number failed (plus input/expected for visible cases).
- Admin portal (`ROLE_ADMIN` only): platform stats, student list with role
  management, and full problem CRUD with test-case editing.
- Seeded admin login: `admin@prepverse.com / admin123` (change in production).
