# PrepVerse — Viva Q&A cheat sheet

## Architecture
**Q: Describe the architecture.**
A: React SPA → stateless Spring Boot REST API (JWT) → MySQL 8. Code
execution goes to the Piston API; AI chat to Gemini. Prod adds nginx
(SPA + `/api` proxy) and Docker Compose for all three services.

**Q: Why Java + Spring Boot + MySQL?**
A: Enterprise placement relevance, strong typing end-to-end, Spring
Security for JWT + method security, JPA for 16 tables, MySQL for
relational progress data (solves, attempts, streaks).

**Q: Why Java 21?**
A: Virtual threads (`spring.threads.virtual.enabled=true`) — blocking
Piston/Gemini/JDBC calls no longer pin platform threads, so one small
server handles many concurrent students.

## Auth & security
**Q: How does login/session work?**
A: BCrypt-checked credentials return a 15-minute access JWT + a 30-day
opaque refresh token (SHA-256 hash stored). The client silently
refreshes on 401 and retries once; logout revokes all tokens.

**Q: What stops refresh-token theft?**
A: Single-use rotation — every refresh revokes the old token. Presenting
an already-revoked token signals theft, so the whole token family is
wiped and the user must log in again.

**Q: How is brute force handled?**
A: Sliding-window `RateLimitFilter`: auth 10/min per IP, submits
10/min per user, AI 20, compiler 30 — with 429 + `Retry-After`.

**Q: How are admin APIs protected?**
A: `@EnableMethodSecurity` + `@PreAuthorize("hasRole('ADMIN')")`; admins
can't demote themselves; JWT authorities carry `ROLE_ADMIN`.

## Online judge
**Q: Walk through a submit.**
A: `POST /api/problems/{id}/submit` validates language → loads hidden +
visible cases → runs each via Piston (5 s) → first failure decides the
verdict → saves the submission; Accepted marks solved and bumps
score/XP/readiness and the streak.

**Q: Can students see hidden test cases?**
A: No. Responses include only the failed case number (plus input/expected
for visible cases). The DB columns are never serialized publicly, and
tests assert the redaction.

**Q: What if Piston is down?**
A: The judge returns `Judge Error` and saves/scores nothing — an honest
error instead of a fake verdict. Covered by a unit test.

**Q: How is output compared?**
A: Lenient: CRLF→LF, trailing whitespace per line ignored, edge blank
lines ignored — so `1 2\n` matches `1 2`.

## Data & features
**Q: How are streaks computed?**
A: `user_activity` holds one row per active day (written on Accepted
submits and mock attempts). The streak counts back consecutive days;
it's alive if today or yesterday has activity.

**Q: Offline behavior?**
A: Banks and progress are cached in localStorage; solved sets
union-merge with the server (offline solves are pushed up, never lost);
judge/AI calls show readable errors, never fake Accepted results.

**Q: What does the analytics page show?**
A: Server-computed accuracy, mock averages, current streak, 14-day
accepted/total activity and per-topic accuracy with a weakest-topic
diagnostic — with an offline-cache fallback.

## Ops
**Q: What is exposed for operations?**
A: Actuator: public `/actuator/health|info`, admin-only metrics and the
last-100-requests exchange log; rolling file logs (`logs/prepverse.log`).

**Q: How does CI work?**
A: GitHub Actions on push/PR: backend `mvn verify` (38 tests, no DB),
frontend `tsc --noEmit` + production build.

**Q: How do you deploy?**
A: `docker compose up --build` (MySQL + API + nginx frontend), or split
Render/Railway API + Vercel SPA with `VITE_API_URL` and CORS set.
See `DEPLOY.md` for the checklist.
