# Tasks: Personal Todo List

**Input**: Design documents from `/specs/001-personal-todo/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included. The constitution requires tests with each story, Vitest coverage of at least 70 percent, and at least five Playwright journeys.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`, `e2e/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create `backend/`, `frontend/`, `e2e/`, and `docs/qa/` directories per `specs/001-personal-todo/plan.md`
- [X] T002 Add Fastify and Vitest dependencies in `backend/package.json`
- [X] T003 [P] Add React, Vite, and Vitest dependencies in `frontend/package.json`
- [X] T004 [P] Add Playwright and axe dependencies in `e2e/package.json`
- [X] T005 [P] Add root `.gitignore` plus `backend/.dockerignore` and `frontend/.dockerignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Open SQLite and create the `todos` table in `backend/src/db.js` (`id` integer primary key, `text` required, `completed` integer default 0, `created_at` required)
- [X] T007 Build the Fastify app shell and `GET /api/health` in `backend/src/server.js`
- [X] T008 [P] Add the Vite app shell in `frontend/index.html`, `frontend/vite.config.js`, and `frontend/src/main.jsx`
- [X] T009 Add multi-stage non-root `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`, and `docker-compose.yml` with `dev` and `test` profiles

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - See my tasks (Priority: P1) 🎯 MVP

**Goal**: Opening the app shows tasks newest first, or a loading, empty, or error state

**Independent Test**: With no rows, the UI shows "No tasks yet. Add one below." A failed `GET /api/todos` shows an alert and Retry.

### Tests for User Story 1

- [X] T010 [P] [US1] API integration test for `GET /api/todos` and `GET /api/health` in `backend/tests/api.test.js`
- [X] T011 [P] [US1] Component tests for loading, empty, list, and load error in `frontend/src/App.test.jsx`

### Implementation for User Story 1

- [X] T012 [US1] List tasks newest first in `backend/src/todos.js` (`created_at` descending, then `id` descending)
- [X] T013 [US1] Serve `GET /api/todos` from `backend/src/server.js`
- [X] T014 [P] [US1] Fetch the list in `frontend/src/api.js`
- [X] T015 [US1] Render loading, empty, error+retry, and the list in `frontend/src/App.jsx` and `frontend/src/styles.css`

**Checkpoint**: User Story 1 is functional and testable independently

---

## Phase 4: User Story 2 - Add a task (Priority: P2)

**Goal**: A person can add a trimmed description of 1-200 characters and see it after refresh

**Independent Test**: POST a valid description returns 201 and the task is not done. Empty and 201-character descriptions return 400 with `Description must be 1-200 characters.`

### Tests for User Story 2

- [X] T016 [P] [US2] Unit tests for trim, empty, 200, and 201-character text in `backend/tests/todos.test.js`
- [X] T017 [P] [US2] Component test for add success and validation errors in `frontend/src/App.test.jsx`

### Implementation for User Story 2

- [X] T018 [US2] Validate and insert tasks in `backend/src/todos.js` (trim; length after trim is 1-200; `completed` starts false; `created_at` set once)
- [X] T019 [US2] Serve `POST /api/todos` from `backend/src/server.js`
- [X] T020 [US2] Submit the form from `frontend/src/App.jsx` using `frontend/src/api.js`

**Checkpoint**: User Stories 1 and 2 work independently

---

## Phase 5: User Story 3 - Complete a task (Priority: P3)

**Goal**: A person can mark a task done and not done, with a visual distinction that survives refresh

**Independent Test**: PATCH `{ "completed": true }` then false. A missing id returns 404 `Task not found.` A non-boolean returns 400 `Completed must be true or false.`

### Tests for User Story 3

- [X] T021 [P] [US3] API tests for complete, reopen, 400, and 404 in `backend/tests/api.test.js`
- [X] T022 [P] [US3] Component test for the done style and checkbox in `frontend/src/App.test.jsx`

### Implementation for User Story 3

- [X] T023 [US3] Update `completed` in `backend/src/todos.js` (boolean only; unknown id does not change other rows)
- [X] T024 [US3] Serve `PATCH /api/todos/:id` from `backend/src/server.js`
- [X] T025 [US3] Toggle the checkbox and apply the `done` class in `frontend/src/App.jsx` and `frontend/src/styles.css`

**Checkpoint**: User Stories 1-3 work independently

---

## Phase 6: User Story 4 - Delete a task (Priority: P4)

**Goal**: A person can delete one task. The last deletion shows the empty state.

**Independent Test**: DELETE one of two tasks leaves the other. DELETE of an unknown id returns 404. Deleting the last task shows the empty state.

### Tests for User Story 4

- [X] T026 [P] [US4] API test for delete and 404 in `backend/tests/api.test.js`
- [X] T027 [P] [US4] Component test for delete and the empty state in `frontend/src/App.test.jsx`

### Implementation for User Story 4

- [X] T028 [US4] Delete by id in `backend/src/todos.js`
- [X] T029 [US4] Serve `DELETE /api/todos/:id` from `backend/src/server.js` (204 empty body, 404 `{ "error": "Task not found." }`)
- [X] T030 [US4] Wire the Delete button in `frontend/src/App.jsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Deployment, end-to-end proof, and the training reports

- [X] T031 [P] Playwright journeys for empty, create, complete, delete, and load error in `e2e/todos.spec.js`
- [X] T032 [P] Accessibility audit in `e2e/todos.spec.js` using `@axe-core/playwright`
- [X] T033 Coverage gate of at least 70 percent in `backend/vitest.config.js` and `frontend/vite.config.js`
- [X] T034 [P] Setup and Spec Kit notes in `README.md` and `docs/speckit-guidance.md`
- [X] T035 [P] AI integration log in `docs/ai-integration-log.md`
- [X] T036 [P] QA reports in `docs/qa/coverage.md`, `docs/qa/accessibility.md`, `docs/qa/security.md`, and `docs/qa/performance.md`
- [X] T037 Run `specs/001-personal-todo/quickstart.md` checks (unit tests, e2e, `docker compose up`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Adds create on top of the list
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Needs a task row, which US2 creates, but the API can be tested with a direct insert
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Same as US3

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Data access before routes
- Routes before the UI that calls them
- Story complete before moving to the next priority

### Parallel Opportunities

- T003, T004, and T005 can run in parallel
- T008 can run in parallel with T006 and T007
- Tests for a story marked [P] can run in parallel
- Once the foundation is done, US3 and US4 API work can proceed in parallel with the UI

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "API integration test for GET /api/todos and GET /api/health in backend/tests/api.test.js"
Task: "Component tests for loading, empty, list, and load error in frontend/src/App.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Polish with Playwright, Docker, and QA reports

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3 and User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
