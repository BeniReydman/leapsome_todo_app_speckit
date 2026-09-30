# AI integration log

Recorded while building the personal todo app with Spec Kit on 2026-09-30.

## Agent usage

The Cursor agent installed Spec Kit (`specify-cli` 1.0.13) and followed the project skills in order: constitution, specify, plan, tasks, implement.

Prompts that worked were the skill files themselves. They force a spec with no framework names, a plan that records rejected options, and tasks in the form `- [ ] T000 [P] [US1] description with a file path`. Writing code before `tasks.md` existed would have skipped that gate.

The agent chose the stack inside `/speckit-plan`: Fastify for schema-free handlers plus `inject`, `node:sqlite` so there is no extra database container, React so component tests can render loading and error states. A person still has to accept that those choices match the constitution's "smallest product" rule.

## MCP and tools

| Tool | Use |
| --- | --- |
| Spec Kit CLI | `specify init`, template resolution, `setup-plan.sh`, `setup-tasks.sh` |
| Cursor browser | Clicked through empty state, validation, add, complete, reload, and delete on http://localhost:8090 |
| Chrome DevTools via that browser | `Runtime.evaluate` for Navigation Timing and computed strikethrough. `Performance.getMetrics` returned no samples because the Performance domain was not enabled. |
| Playwright + axe-core | End-to-end journeys and the accessibility audit |
| Docker Compose | Build, health, non-root users, and the `test` profile |

Postman MCP is not available in this workspace. API contracts were checked with Fastify `inject` and Playwright's request fixture instead.

## Test generation

The agent wrote Vitest cases from the spec's acceptance scenarios and the API contract: trim, 200 vs 201 characters, 400/404 bodies, health failure, and the four UI states. Playwright covered empty, create plus refresh, complete, delete, load failure plus retry, blank input, a phone-width XSS payload, and axe.

What the first test pass missed:

- `getByText` matched both the visible label and the visually hidden delete name. Queries had to use the checkbox role.
- Playwright `locator.check()` fails on a checkbox that updates after `fetch`, even when the click worked. Tests click, then assert.
- `DELETE` sent `content-type: application/json` with an empty body. Fastify answered 400 `Bad Request`, so delete looked broken in the browser. The client now sets that header only when there is a body.

## Debugging with AI

The delete failure showed up as an alert reading "Bad Request" in the Playwright snapshot, which is Fastify's default error shape rather than the app's `Task not found.` message. That pointed at body parsing, not the SQL delete.

Port 8080 was already published by another compose project (`leapsome_todo_app`). This stack publishes host port 8090. The container port is still 8080.

## Limitations

- The agent did not run a multi-user or load test. The spec is one shared list.
- Navigation Timing on a local reload was 30ms to `loadEventEnd`. That does not say how the app behaves on a slow network.
- `npm audit` reports moderate issues in frontend and backend dev dependencies (including `glob` via Vitest). The production API image uses `npm ci --omit=dev` and reported 0 vulnerabilities. The UI image serves built files from nginx and does not ship those dev packages.
- Spec Kit skills tell the agent not to start implementation during the constitution step. The full training deliverable was still done in this session, after the spec artifacts existed.
- Judgment that stayed with a person: leaving out edit, filters, and auth; accepting a single SQLite file; choosing host port 8090 rather than stopping the other app.
