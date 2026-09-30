# Quickstart: Personal Todo List

Validates the feature end to end. Implementation steps live in [tasks.md](./tasks.md). The API shape is [contracts/todos-api.md](./contracts/todos-api.md). Fields are in [data-model.md](./data-model.md).

## Prerequisites

- Node.js 24
- npm
- Docker with Compose v2, for the container check

## Local app

```bash
npm install --prefix backend
npm install --prefix frontend
npm install --prefix e2e
npm test --prefix backend
npm test --prefix frontend
npm start --prefix backend
npm run dev --prefix frontend
```

The API listens on port 3000. The Vite dev server listens on port 5173 and proxies `/api` to the API.

## What to check by hand

1. Open the UI. With an empty database, the empty state is visible (User Story 1).
2. Add "Buy milk". It appears as not done. Reload. It is still there (User Story 2).
3. Mark it done. It is visually distinct. Reload. It stays done. Mark it open again (User Story 3).
4. Delete it. The empty state returns. Reload. It stays gone (User Story 4).
5. Stop the API and reload the UI. An error and a retry control are visible.

## Automated checks

```bash
npm test --prefix backend
npm test --prefix frontend
npm run test:e2e --prefix e2e
```

End-to-end tests expect the dev servers, or `PLAYWRIGHT_BASE_URL` pointed at a running UI.

## Container check

```bash
docker compose up --build
```

Open `http://localhost:8090`. `GET http://localhost:8090/api/health` returns `{ "status": "ok" }`. Host port 8090 is used so this stack can run beside another local service on 8080. The container still listens on 8080.

```bash
docker compose --profile test run --rm backend-test
docker compose --profile test run --rm frontend-test
docker compose down
```
