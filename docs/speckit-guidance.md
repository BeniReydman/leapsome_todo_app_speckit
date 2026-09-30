# How Spec Kit guided this app

The training activity describes a BMAD pass: project brief, architecture, stories, tests, then Docker and QA. This repository uses GitHub Spec Kit 1.0.13 (`specify` CLI, Cursor agent skills) for the same outcomes.

## What replaced each BMAD step

| Training step | Spec Kit artifact |
| --- | --- |
| PM project brief and PRD refinement | `.specify/memory/constitution.md` and `specs/001-personal-todo/spec.md` |
| Architect: stack, API, components | `plan.md`, `research.md`, `data-model.md`, `contracts/todos-api.md` |
| Stories and acceptance criteria | User stories in `spec.md`, turned into `tasks.md` |
| Test strategy | Test tasks inside each story phase, plus the polish phase |
| Implementation | `/speckit-implement` against `tasks.md` |
| QA reports | `docs/qa/` |

## Order that was followed

1. `specify init --here --integration cursor-agent --script sh`
2. `/speckit-constitution` — five gates: spec before code, smallest product, tests with the feature, accessible UI, `docker compose up`
3. `/speckit-specify` — personal todo list, four user stories, no tech stack in the spec
4. `/speckit-plan` — Node 24, Fastify, `node:sqlite`, React, Vitest, Playwright
5. `/speckit-tasks` — setup, foundation, one phase per story, polish
6. Implementation from `tasks.md`, then the quickstart checks

The spec stays free of frameworks. Technical choices are only in the plan, and each choice in `research.md` names the alternative that was skipped.

## What that changed in the build

- No accounts, priorities, or due dates, because the spec marks them out of scope.
- SQLite in the API process, because a separate database service was not required.
- Tests are listed inside each story, so the API and the screen were not added first and tested later.
- `docker compose up` is a constitution gate, not a follow-up task.

## Where to read next

- Behavior: `specs/001-personal-todo/spec.md`
- API: `specs/001-personal-todo/contracts/todos-api.md`
- Commands: `specs/001-personal-todo/quickstart.md`
- What the agent did: `docs/ai-integration-log.md`
