# HundredPath Deployment Guide

Both the frontend and the API run in **one container on a single Hetzner server managed
by Coolify**, reachable at `https://hundredpath.simonecamerano.dev`. The pages are served
from the same origin as the API, so no external service delivers the site to visitors and
no CORS configuration is needed.

## Prerequisites

- GitHub account
- A Coolify instance on your own server
- MongoDB Atlas account (free tier is enough)

---

## 1. MongoDB Atlas (database)

1. Create a free M0 cluster. **Pick a region inside the EU** (Frankfurt) if your privacy
   policy claims the data stays in the European Union.
2. Create a database user.
3. Allow the server's IP address, or `0.0.0.0/0` if the address is not static.
4. Copy the connection string:
   `mongodb+srv://<user>:<password>@cluster.mongodb.net/hundredpath?retryWrites=true&w=majority`

---

## 2. Coolify resource

Create one application resource from the GitHub repository:

| Setting | Value |
|---|---|
| Build Pack | Dockerfile |
| **Base Directory** | `/` |
| Dockerfile Location | `/Dockerfile` |
| Branch | `main` |
| Port | `3000` |
| Domain | `https://hundredpath.simonecamerano.dev` |

**Base Directory must be `/`, not `/backend`.** The root `Dockerfile` is a two stage
build: the first stage compiles the frontend, the second copies `frontend/dist` into the
backend image as `public/`. With the base directory set to `/backend` the build has no
access to the frontend sources and only the API gets deployed.

Environment variables on the resource:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a random 32+ character string>
```

`FRONTEND_URL` is no longer required: the pages and the API share one origin, so the CORS
allow list is not used in production. Keep it only if you also serve the frontend from a
different host.

`frontend/.env.production` sets `VITE_API_URL=/api`, a relative path. Do not point it at
an absolute host: that would send the browser to a different origin and reintroduce CORS.

---

## 3. Deploy

Push to `main`. Coolify builds the image and restarts the container.

Routes after deployment:

- `/` and every non `/api` path return the compiled Vue app, so deep links survive a
  hard refresh
- `/api/*` is handled by Express
- `/api/health` reports the API status and whether the database is connected

---

## 4. Data retention

The privacy policy promises that accounts inactive for 24 months are deleted. The script
that does it lives in `backend/scripts/purge-inactive-accounts.js` and runs as a dry run
unless called with `--apply`.

On the host, a monthly cron job runs it inside the container. **Select the container by
the UUID of the Coolify resource, not by name**: the container name changes on every
deploy, so a job pinned to the name silently stops working.

```bash
C=$(docker ps --format '{{.Names}}' | grep "^<resource-uuid>" | head -1)
docker exec "$C" node scripts/purge-inactive-accounts.js --apply
```

---

## 5. Verification checklist

1. `https://hundredpath.simonecamerano.dev/api/health` returns `"database":"connected"`
2. The home page loads, and a deep link such as `/leaderboard` still works after a
   manual refresh
3. Registration and login succeed, and a game can be started and saved
4. The browser network tab shows **no requests to third party domains**: avatars are
   generated locally by the bundled DiceBear library
5. The frontend is a single page app, so the page text lives inside
   `assets/index-*.js`, not in the HTML. Search the bundle to confirm a text change
   actually shipped
