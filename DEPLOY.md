# Deploying PrepVerse to production

Two supported layouts. Both keep secrets in environment variables —
nothing secret is ever committed (see `backend/.env.example`).

## Option A — Full stack with Docker Compose (VPS, viva demo)

One command runs MySQL + Java backend + React frontend (nginx):

```bash
cd backend
cp .env.example .env        # then edit: JWT_SECRET, MYSQL_PASSWORD, ...
docker compose up --build -d
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://SERVER:5173    |
| Backend  | http://SERVER:8080    |
| MySQL    | SERVER:3306 (internal use; close it publicly) |

nginx proxies `/api/*` to the backend container, so the frontend needs
no API URL configured (`VITE_API_URL` stays empty). First boot seeds
50 problems, 129 content rows and demo accounts automatically.

```bash
docker compose logs -f backend   # watch startup
curl http://SERVER:8080/api/health
```

Behind HTTPS (recommended): terminate TLS in Caddy/nginx/Cloudflare in
front of `:5173`, then set `CORS_ALLOWED_ORIGINS=https://your-domain`.

## Option B — Split deploy (Render + Vercel, free tiers)

**Backend + MySQL on Render (or Railway):**

1. Create a MySQL instance; note the host, user, password, database.
2. Create a Web Service from this repo, root directory `backend`,
   Docker runtime (uses `backend/Dockerfile`).
3. Environment variables:

| Variable             | Value                                              |
|----------------------|----------------------------------------------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST:3306/prepverse?createDatabaseIfNotExist=true&useSSL=true&serverTimezone=UTC` |
| `MYSQL_USER`         | db user                                            |
| `MYSQL_PASSWORD`     | db password                                        |
| `JWT_SECRET`         | `openssl rand -hex 32`                             |
| `GEMINI_API_KEY`     | optional                                           |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app`               |

4. Deploy, then verify `https://<api>/api/health` returns `{"status":"UP"}`.

**Frontend on Vercel (or Netlify):**

1. Import the repo, root directory `prepverse`, framework Vite.
2. Build command `npm run build`, output directory `dist`.
3. Environment variable: `VITE_API_URL=https://<your-api-host>`
   (no trailing slash). Redeploy after changing it — Vite bakes the
   value in at build time.
4. Open the site → **Instant Guest Demo Access** should log in via the
   live backend (check DevTools Network: `/api/auth/demo` → 200).

## Production checklist

- [ ] `JWT_SECRET` is long + random (≥ 32 bytes) and unique per env.
- [ ] `CORS_ALLOWED_ORIGINS` lists only your real frontend origin(s).
- [ ] MySQL is not reachable from the public internet (bind/firewall).
- [ ] Seed logins changed: `admin@prepverse.com / admin123`,
      `demo@prepverse.com / demo1234` (or disable demo in prod).
- [ ] HTTPS enabled; backend `useSSL=true` for managed MySQL.
- [ ] `docker compose logs` / host logs show no startup errors.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Frontend shows mock/offline data | `VITE_API_URL` wrong or backend down; check `/api/health` |
| CORS errors in console | `CORS_ALLOWED_ORIGINS` must match the frontend origin exactly |
| 401 on every call after deploy | New `JWT_SECRET` invalidates old tokens — log in again |
| Backend exits: Communications link failure | DB host/credentials wrong; check `SPRING_DATASOURCE_URL` |
| Slow first submit | Piston cold-start; retries are safe (no double-scoring) |
