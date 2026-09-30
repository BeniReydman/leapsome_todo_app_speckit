# Framework comparison

Same training brief, two repos. `leapsome_todo_app` used BMAD. This repo used GitHub Spec Kit 1.0.13. Times are from file birth times and Cursor chat records on 30 Sep 2026.

## What each framework produced

| Training ask | BMAD repo | This repo |
| --- | --- | --- |
| Brief and refined PRD | `_bmad-output/todo-app/brief-todo/`, `prd-todo/` | `.specify/memory/constitution.md`, `specs/001-personal-todo/spec.md` |
| Architecture and API | `architecture-todo/` | `plan.md`, `research.md`, `data-model.md`, `contracts/todos-api.md` |
| Stories and acceptance criteria | `initiative-todo/epic-todo-list/` | User stories in `spec.md`, tasks in `tasks.md` |
| Tests with the work | Vitest and Playwright | Vitest and Playwright, listed inside each story phase |
| Containers and QA notes | Docker Compose and `_bmad-output/todo-app/qa/` | Docker Compose and `docs/qa/` |

Both apps are a single shared list: create, view, complete, delete. Both run with `docker compose up` and ship unit, integration, and end-to-end tests.

## How long the build took

| | BMAD | Speckit |
| --- | --- | --- |
| Build chat | 10:54–11:41, about 47 minutes | 12:13–12:25, about 12 minutes |
| New project files | 10:58–11:07, about 9 minutes | 12:14–12:25, about 11 minutes |
| Later chat with no new files | 11:40–12:06, about 26 minutes | none |

The BMAD chat was about four times longer. The files themselves appeared in a similar window. Most of the extra BMAD time was the conversation around that burst, including a rewrite of 55 files at 11:38.

## Tokens

Cursor stored a context-window size for each chat, out of 256,000. It did not store cumulative input and output tokens. Those counters are zero on every message.

| Chat | Context tokens | Saved at |
| --- | --- | --- |
| BMAD build | 183,894 | 11:39, end of that chat |
| BMAD follow-up | 62,187 | 12:06, end of that chat |
| Speckit | 192,319 | 12:29, after the comparison questions |

Those numbers are the size of the window at save time, not a bill.
