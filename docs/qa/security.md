# Security review

Review of the v1 todo app on 2026-09-30. Scope is one shared list with no accounts, as the spec requires.

## Findings

| Item | Result |
| --- | --- |
| Cross-site scripting | Task text is rendered as React text, not HTML. A Playwright test adds `<img src=x onerror=alert(1)>` and expects no dialog. The nginx image sets `Content-Security-Policy: default-src 'self'` and `X-Content-Type-Options: nosniff`. |
| SQL injection | Writes use `node:sqlite` placeholders. A unit test stores `'; DROP TABLE todos;--` and checks the table still exists. |
| Input size | Descriptions are trimmed and rejected outside 1-200 characters on the client and the server. Fastify's default body limit still applies. |
| Delete request | The first client sent `content-type: application/json` on `DELETE` with no body. Fastify treated that as a bad body and returned 400, which skipped the delete. The client now sets the JSON content type only when a body is present. |
| Authentication | Not implemented. Anyone who can reach the port can read and change the list. Accepted for v1. Do not expose the port on a shared network without adding auth in a later spec. |
| Errors | API errors are short strings (`Description must be 1-200 characters.`, `Task not found.`, `Not found`). Health returns `ok` or `error` and does not include paths or SQL. |
| Containers | API runs as `node` (uid 1000). UI runs as `nginx` (uid 101). Confirmed with `docker compose exec … id`. |
| Dependencies | `npm ci --omit=dev` in the API image reported 0 vulnerabilities. Dev trees (Vitest and friends) report 3 moderate issues; they are not copied into the production images. |

## Not in this version

No rate limiting, no security headers on the API process itself (headers are on nginx), no CSRF token. The browser talks to the same origin through the nginx `/api` proxy, so a classic cross-site form would still be possible if the port is reachable. That is the same residual as "no authentication" above.
