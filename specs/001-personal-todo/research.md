# Research: Personal Todo List

## Decision: Node.js 24 with ESM

- **Decision**: Application code is JavaScript ESM on Node.js 24.
- **Rationale**: The developer machine and the container base image can match. No compile step on the API.
- **Alternatives considered**: TypeScript (more tooling for a four-endpoint API), Python (would split the test story from the frontend).

## Decision: Fastify for the API

- **Decision**: Fastify 5 serves the HTTP API and validates bodies with JSON Schema.
- **Rationale**: Schema validation, structured errors, and `app.inject()` cover the integration-test requirement without a second HTTP client.
- **Alternatives considered**: Raw `node:http` (more hand-written routing for the same tests), Express (extra middleware for validation).

## Decision: `node:sqlite` for persistence

- **Decision**: Store tasks with `DatabaseSync` from `node:sqlite`.
- **Rationale**: Durable across restart, parameterized statements, no native addon and no extra database container. Node 24 exposes it without an experimental flag.
- **Alternatives considered**: A JSON file (easy to corrupt on overlapping writes), Postgres (a third container the spec does not need).

## Decision: React + Vite for the UI

- **Decision**: One React screen built with Vite. Production assets are served by nginx.
- **Rationale**: Component tests can render empty, loading, error, and list states. React escapes text by default, which is the XSS control.
- **Alternatives considered**: A single vanilla page (fewer dependencies, clumsier component tests).

## Decision: Vitest and Playwright

- **Decision**: Vitest for unit, API, and component tests with v8 coverage. Playwright for journeys. `@axe-core/playwright` for one accessibility audit.
- **Rationale**: Matches the training targets (Vitest, Playwright, ≥70% coverage, ≥5 end-to-end tests, WCAG check).
- **Alternatives considered**: Node's built-in test runner (does not match the requested Vitest setup), Jest (heavier for Vite).

## Decision: Compose layout

- **Decision**: Two services on the default project: `backend` and `frontend`. Profile `dev` adds watch-mode API and Vite on separate ports. Profile `test` runs the Vitest suites inside images built from a `test` target.
- **Rationale**: `docker compose up` satisfies the delivery gate. Profiles cover dev and test without changing code. Environment variables `PORT`, `DB_PATH`, and `NODE_ENV` select behavior.
- **Alternatives considered**: One container for both (contradicts separate Dockerfiles), binding dev and prod to the same ports (they would clash when the profile is enabled).
