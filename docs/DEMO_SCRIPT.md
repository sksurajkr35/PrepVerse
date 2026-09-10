# PrepVerse — 5-minute demo script

## 0:00 Setup (before the audience arrives)
- `cd backend && docker compose up --build -d`, open `:5173` + `:8080/swagger-ui.html`.
- Log in once as `admin@prepverse.com / admin123` to warm caches, then log out.

## 0:00–0:45 Landing + guest login
- Show the landing page → **Instant Guest Demo Access**.
- Point out the dashboard (score, streak, rating are live profile fields).

## 0:45–2:15 The online judge (core)
- DSA page: 50 problems from MySQL; open **Two Sum**.
- Code Arena: Run with custom input (real Piston execution).
- Submit a correct solution → **Accepted**, confetti, score +5.
- Submit a wrong solution → **Wrong Answer**, failed case shown.
- Mention: hidden cases never leak; Piston-down returns Judge Error.

## 2:15–3:15 Breadth (30 s each)
- Aptitude: answer an MCQ, explanation appears.
- Mock test: start one, show timer + proctored mode (submit optional).
- Companies: open Amazon kit (pattern table, HR questions).
- AI Mentor: ask "explain binary search" (live or fallback).

## 3:15–4:00 Persistence + analytics
- Study Plan: toggle a task (auto-saved to MySQL).
- Analytics: real accuracy, 14-day activity, weak-topic diagnostic.
- Leaderboard: real ranked users.

## 4:00–4:45 Admin portal
- Log in as admin → stats, students, role toggle.
- Problems tab: show test-case editing (visible + hidden flags).
- Swagger UI: JWT-authorized endpoints; `/actuator/health`.

## 4:45–5:00 Close
- `git log` / CI badge: tests + build green on every push.
- One-liner: "Real judging, real MySQL persistence, real analytics —
  deployable with one command."
