# Implementation Plan: Personal Todo List

**Branch**: `001-personal-todo` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-todo/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single person can see, add, complete, and delete tasks. The UI is a small React page. The API is a Fastify server that stores tasks in SQLite through `node:sqlite`. Tests ship with each story (Vitest for rules, API, and components; Playwright for journeys). `docker compose up` builds a non-root API image and a non-root nginx image that proxies `/api`.

## Technical Context

**Language/Version**: Node.js 24, JavaScript (ESM)

**Primary Dependencies**: Fastify 5 (API, schema validation, `inject` for tests), React 19 + Vite 6 (UI), Vitest 3, Playwright

**Storage**: SQLite via `node:sqlite` (`DatabaseSync`). File path from `DB_PATH`. No separate database container.

**Testing**: Vitest (unit, API integration, React component) with `@vitest/coverage-v8`; Playwright for end-to-end, including `@axe-core/playwright` for one accessibility pass

**Target Platform**: Linux containers; local Node for development. UI in a current desktop or mobile browser.

**Project Type**: Web application (frontend + backend)

**Performance Goals**: List or empty state visible within 2 seconds on a local compose stack. API list/create/update/delete well under 100 ms for a few hundred tasks.

**Constraints**: Description trimmed, 1–200 characters. No auth. Non-root images, health checks, compose profiles for dev and test. Meaningful coverage ≥ 70%. At least five Playwright tests. Zero critical axe violations.

**Scale/Scope**: One shared list, one screen, four actions. Expected size is tens to a few hundred tasks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Result |
| --- | --- |
| I. Spec Before Code | Pass. This plan follows `spec.md`. Implementation waits for `tasks.md`. |
| II. Smallest Complete Product | Pass. No accounts, filters, or extra services. SQLite is in-process. |
| III. Tests With the Feature | Pass. Each story phase in tasks includes failing tests first. Coverage gate is 70%. |
| IV. Clear and Accessible Interaction | Pass. One form, named controls, empty/loading/error states, axe check. |
| V. Runnable by Default | Pass. `docker compose up` starts API + UI. `dev` and `test` profiles are extra. |

Post-design re-check: same result. No Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-todo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── todos-api.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── server.js
│   ├── db.js
│   └── todos.js
├── tests/
│   ├── todos.test.js
│   └── api.test.js
├── package.json
└── Dockerfile
frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api.js
│   └── App.test.jsx
├── index.html
├── vite.config.js
├── nginx.conf
├── package.json
└── Dockerfile
e2e/
├── playwright.config.js
└── todos.spec.js
docker-compose.yml
docs/
├── speckit-guidance.md
├── ai-integration-log.md
└── qa/
```

**Structure Decision**: Web application layout. Backend owns persistence and validation. Frontend owns presentation and calls `/api`. Nginx in the frontend image reverse-proxies `/api` so the browser uses one origin. E2E lives at the repo root of `e2e/` so it can target either Vite or the compose URL.

## Complexity Tracking

> No constitution violations.
