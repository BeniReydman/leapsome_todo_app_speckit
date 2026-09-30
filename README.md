# Personal Todo List

A small full-stack todo app: one shared list, create, complete, and delete. Built with [GitHub Spec Kit](https://github.com/github/spec-kit) instead of BMAD. The specification lives in `specs/001-personal-todo/`.

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost:8090. The UI container listens on 8080 and is published on host port 8090. `GET /api/health` returns `{ "status": "ok" }`.

```bash
docker compose down
```

Data is stored in the `todo-data` volume (`DB_PATH=/data/todos.sqlite`).

### Profiles

| Command | What it does |
| --- | --- |
| `docker compose up` | API + nginx UI. `NODE_ENV` defaults to `production`. |
| `docker compose --profile dev up` | Also starts a watch-mode API on port 3000 and Vite on port 5173. |
| `docker compose --profile test run --rm backend-test` | Vitest in the backend image. |
| `docker compose --profile test run --rm frontend-test` | Vitest in the frontend image. |

`PORT`, `DB_PATH`, and `NODE_ENV` configure the API. Vite uses `API_PROXY_TARGET` (default `http://127.0.0.1:3000`).

## Run locally

Requires Node.js 24.

```bash
npm install --prefix backend
npm install --prefix frontend
npm install --prefix e2e
npx --prefix e2e playwright install chromium

npm test --prefix backend
npm test --prefix frontend
npm start --prefix backend
npm run dev --prefix frontend
npm run test:e2e --prefix e2e
```

The API listens on port 3000. Vite listens on port 5173 and proxies `/api`.

## Layout

- `backend/` — Fastify and SQLite (`node:sqlite`)
- `frontend/` — React and Vite, nginx in production
- `e2e/` — Playwright
- `specs/001-personal-todo/` — Spec Kit spec, plan, and tasks
- `docs/` — how Spec Kit was used, the framework comparison, the AI log, and QA notes

## Quality

Application code coverage is above 70% (backend about 95% lines, frontend 100% lines). Eight Playwright tests pass, including empty, create, complete, delete, load error, and an axe check with zero violations.
