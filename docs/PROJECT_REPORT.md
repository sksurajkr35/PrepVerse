# PrepVerse — Placement Preparation Platform
### Major Project Report (Java Full Stack + MySQL)

## 1. Abstract

PrepVerse is a full-stack placement preparation platform for engineering
students. It combines a **real online code judge** (hidden test cases,
verdicts like Accepted / Wrong Answer / TLE), a 50-problem DSA bank, aptitude
practice, mock assessments, company hiring kits, core-CS notes, interview
preparation, an AI mentor, resume builder, study planner, leaderboard and
performance analytics — backed by a Java Spring Boot API and MySQL.

## 2. Objectives

- Real code execution and judging (no mocked verdicts).
- Persistent progress: solves, submissions, attempts, streaks, resume, plans.
- Secure session handling with short-lived JWTs + rotating refresh tokens.
- Admin portal for faculty/placement cells (stats, users, question bank).
- One-command local run and documented production deployment.

## 3. Technology stack

| Layer    | Choice                                                        |
|----------|---------------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Recharts        |
| Backend  | Java 21, Spring Boot 3.2, Security (JWT), Data JPA, Actuator  |
| Database | MySQL 8                                                       |
| Build/CI | Maven, npm, GitHub Actions (JUnit + tsc + Vite build)        |
| Deploy   | Docker + Compose, nginx; Render/Vercel split layout           |
| External | Piston (code execution), Gemini 2.5 Flash (AI mentor)         |

## 4. System architecture

```
Browser (React :5173)
   |  /api/* (JWT)            VITE_API_URL="" -> same origin
   v
nginx (prod) --/api/*--> Spring Boot (:8080) --> MySQL 8 (:3306)
      |                       |--> Piston (run + judge)
      +--> index.html         |--> Gemini (AI mentor)
```

- Stateless REST API; JWT in `Authorization: Bearer` header.
- Java 21 virtual threads for blocking I/O (Piston/Gemini/MySQL).
- React works offline: cached banks + clearly-labeled fallbacks.

## 5. Modules

1. **Online judge** — `POST /api/problems/{id}/submit` runs every test
   case (visible + hidden) via Piston with a 5 s limit; verdicts:
   Accepted, Wrong Answer, Time Limit Exceeded, Compilation Error,
   Runtime Error, Judge Error. Hidden input/expected output never leaves
   the server. Comparison is lenient (CRLF, trailing whitespace).
2. **Problem bank** — 50 problems (10 curated + 40 generated), ~160 test
   cases, seeded once by `ProblemSeeder`.
3. **Content banks** — 50 aptitude MCQs, 5 mock tests, 15 company kits,
   9 core-CS subjects, 50 interview Qs in MySQL (`/api/content/*`).
4. **Auth & sessions** — email/password (BCrypt), 15-min access JWT,
   30-day opaque refresh tokens with rotation + reuse detection
   (reuse wipes the token family). Logout revokes everywhere.
5. **Progress** — submissions, solved sets (union-merged offline/online),
   mock attempts, **real streaks** from `user_activity`.
6. **Personal data** — resume builder and study plan auto-saved to MySQL;
   theme synced across devices.
7. **Analytics** — accuracy, mock averages, 14-day activity, topic
   accuracy, weak-area diagnostics from real data.
8. **Admin portal** — stats, student roles, full problem CRUD with
   test-case editing (`ROLE_ADMIN` + `@PreAuthorize`).
9. **AI mentor** — Gemini-backed chat with quota protection + fallback.
10. **Ops** — Actuator health/metrics/exchanges, rolling file logs,
    rate limiting, CI, Docker deploy kit.

## 6. Database design (16 tables)

Auth/progress: `users`, `user_solved_problems`, `submissions`,
`test_attempts`, `test_attempt_topics`, `refresh_tokens`,
`user_activity`, `resume_profiles`, `study_plans`.
Judge/content: `problems`, `test_cases`, `aptitude_questions`,
`mock_tests`, `companies`, `core_subjects`, `interview_questions`.
DDL reference: `backend/db/schema.sql`.

## 7. Security

- BCrypt password hashing; JWTs signed HS256 with env secret.
- Refresh tokens stored as SHA-256 hashes only; single-use rotation.
- Rate limits: auth 10/min/IP, submit 10/min/user, AI 20, compiler 30
  (HTTP 429 + `Retry-After`).
- Authenticated-by-default API; admin routes need `ROLE_ADMIN`;
  no self-demotion; size caps on code (100 KB) and JSON blobs.
- CORS allow-list via environment; no secrets in Git (`.env.example`).

## 8. Testing

38 automated backend tests, no database needed (Mockito + standalone
MockMvc): judging verdicts + hidden-case redaction + judge-down safety,
token rotation/reuse, streak edge cases, JWT tamper/expiry, auth/problem
endpoints, rate-limiter buckets. GitHub Actions runs Maven `verify`,
`tsc --noEmit` and the production build on every push/PR.

## 9. Deployment

- `backend/docker-compose.yml`: MySQL + backend + nginx frontend.
- Or split: API + MySQL on Render/Railway, SPA on Vercel.
- Full guide, env tables and checklist: `DEPLOY.md`.

## 10. Future scope

Redis rate limiting for multi-instance scale, WebSocket live contests,
company-wise analytics for placement cells, mobile app, Ceph/S3 code
artifacts, plagiarism similarity checks.

## 11. Conclusion

PrepVerse delivers an end-to-end, security-conscious placement platform:
real judging, real persistence, real analytics — deployable in one
command and backed by automated tests and CI.
