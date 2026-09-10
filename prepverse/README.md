# PrepVerse Frontend (React + TypeScript + Vite)

UI for PrepVerse — placement preparation platform.
**React 19 · TypeScript · Vite 6 · Tailwind CSS 4**

Talks to the Java backend (`../backend/`, Spring Boot on port 8080).

## Run

Prerequisites: **Node.js 18+**

```bash
cd prepverse
npm install
npm run dev        # -> http://localhost:5173
```

`/api/*` calls are proxied to `http://localhost:8080` by Vite (see `vite.config.ts`,
override with `JAVA_API_URL`). To call a backend directly without the proxy:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

Other scripts: `npm run build` (production bundle in `dist/`), `npm run lint` (`tsc --noEmit`).

## Notes

- **Auth** is JWT: the token from the Java backend is stored in `localStorage`
  (`prepverse_jwt_token`) and sent as `Authorization: Bearer <token>`
  (see `src/services/api.ts`).
- **Offline-friendly**: if the Java backend is unreachable, the app falls back
  to local demo data (login, leaderboard, code runner, AI mentor all keep
  working with clearly-labeled demo responses). Start the backend for real
  persistence in MySQL.
- Static catalogue content (problems, aptitude questions, companies, study
  notes) lives in `src/data/mockData.ts`; user data (profile, submissions,
  attempts, leaderboard) comes from the backend.
