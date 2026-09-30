# Coverage

Measured on 2026-09-30 with Vitest and `@vitest/coverage-v8`. Threshold in both configs is 70% lines, statements, functions, and branches.

## Backend (`npm test --prefix backend`)

13 tests passed.

| File | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| All files | 94.69% | 86.79% | 100% | 94.69% |
| `src/db.js` | 90.47% | 66.66% | 100% | 90.47% |
| `src/server.js` | 89.79% | 75% | 100% | 89.79% |
| `src/todos.js` | 100% | 96.66% | 100% | 100% |

Uncovered: creating the SQLite directory for a file path (`db.js` lines 7-8) and the process entrypoint that calls `start()` (`server.js` lines 56-60). The same suite passed inside `docker compose --profile test run --rm backend-test`.

## Frontend (`npm test --prefix frontend`)

10 tests passed.

| File | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| All files | 100% | 95.65% | 100% | 100% |
| `src/App.jsx` | 100% | 93.93% | 100% | 100% |
| `src/api.js` | 100% | 100% | 100% | 100% |

`src/main.jsx` is the Vite mount and is excluded. Uncovered branch: toggling a task that returns 404 (`App.jsx` around lines 50-54). Delete-on-404 is covered. The same suite passed inside `docker compose --profile test run --rm frontend-test`.

## End to end

`npm run test:e2e --prefix e2e` — 8 passed, against the Vite dev servers and again against http://127.0.0.1:8090.

1. Empty state
2. Create and keep after refresh
3. Mark done and not done
4. Delete back to the empty state
5. Load error and retry
6. Blank description refused
7. Phone-width screen, task text rendered as text
8. Axe: no critical or serious violations
