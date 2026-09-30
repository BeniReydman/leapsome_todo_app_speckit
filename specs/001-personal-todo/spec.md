# Feature Specification: Personal Todo List

**Feature Branch**: `001-personal-todo`

**Created**: 2026-09-30

**Status**: Implemented

**Input**: User description: "Build the full-stack Todo application from the training PRD using Spec Kit instead of BMAD: create, view, complete, and delete personal tasks, with tests, containerized deployment, and quality reports."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See my tasks (Priority: P1)

A person opens the application and immediately sees their personal task list,
newest first. If they have no tasks, they see a clear empty state rather than
a blank page. While the list is loading they see a waiting state. If the list
cannot be loaded they see an error and a way to try again.

**Why this priority**: Without a visible list the other actions have nowhere
to land. This is the first screen a person meets.

**Independent Test**: Open the app with no tasks and confirm the empty state.
Open it with existing tasks and confirm each task's text and status. Force a
load failure and confirm the error and retry.

**Acceptance Scenarios**:

1. **Given** no saved tasks, **When** the person opens the app, **Then** they see an empty state that explains there is nothing to do yet and a way to add one.
2. **Given** saved tasks, **When** the person opens the app, **Then** they see each task's text and whether it is done, newest first.
3. **Given** the list is still loading, **When** the person looks at the page, **Then** they see a waiting state and the list is not announced as empty.
4. **Given** the list cannot be loaded, **When** the person opens the app, **Then** they see an error message and can retry.

---

### User Story 2 - Add a task (Priority: P2)

A person types a short description and adds it to the list. The new task
appears immediately as not done, and it is still there after a refresh.

**Why this priority**: Creating work is the action that makes the list useful.

**Independent Test**: Add a task with valid text and confirm it appears, stays
after refresh, and that blank or oversized text is refused with a message.

**Acceptance Scenarios**:

1. **Given** the list is visible, **When** the person enters a short description and adds it, **Then** the task appears as not done at the top of the list.
2. **Given** a task was just added, **When** the person refreshes, **Then** the same task is still there with the same text and status.
3. **Given** the description is empty or only spaces, **When** the person tries to add it, **Then** nothing is saved and they see why.
4. **Given** the description is longer than 200 characters, **When** the person tries to add it, **Then** nothing is saved and they see why.

---

### User Story 3 - Complete a task (Priority: P3)

A person marks a task done. It stays in the list and is visually distinct from
tasks that are still open. They can mark it open again. The choice survives a
refresh.

**Why this priority**: Completion is how the person knows what is finished
without losing the record.

**Independent Test**: Mark a task done and confirm the visual change and
persistence. Mark it open again and confirm it returns to the active style.

**Acceptance Scenarios**:

1. **Given** an open task, **When** the person marks it done, **Then** it remains in the list and is visually distinct from open tasks.
2. **Given** a done task, **When** the person marks it open again, **Then** it looks like an open task.
3. **Given** a task was marked done, **When** the person refreshes, **Then** it is still done.

---

### User Story 4 - Delete a task (Priority: P4)

A person removes a task they no longer want. It disappears immediately and
does not return after a refresh.

**Why this priority**: Deletion is the last core action. The list is already
useful without it, but the PRD includes it.

**Independent Test**: Delete one task and confirm it is gone, including after
refresh, while other tasks remain.

**Acceptance Scenarios**:

1. **Given** two tasks, **When** the person deletes one, **Then** only the other remains.
2. **Given** a task was deleted, **When** the person refreshes, **Then** it is still gone.
3. **Given** the last task is deleted, **When** the list updates, **Then** the empty state is shown.

---

### Edge Cases

- Whitespace around a description is ignored; the stored text has no leading or trailing spaces.
- Two tasks may share the same description. They stay separate.
- Trying to complete or delete a task that no longer exists shows an error and refreshes the list.
- If saving, completing, or deleting fails, the previous list stays on screen and the person sees a recoverable error.
- A description of exactly 200 characters is accepted. 201 is refused.
- The page is usable with a keyboard only, including add, complete, delete, and retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show the person's tasks when they open the application, newest first.
- **FR-002**: Each task MUST show its description, whether it is done, and when it was created is recorded even if the time is not the main visual.
- **FR-003**: The system MUST show a distinct empty state when there are no tasks.
- **FR-004**: The system MUST show a loading state while the list is being fetched and an error state with retry when the fetch fails.
- **FR-005**: The person MUST be able to add a task by entering a description.
- **FR-006**: The system MUST refuse a description that is empty after trimming or longer than 200 characters, and MUST explain why.
- **FR-007**: A new task MUST start as not done and MUST appear without a manual reload.
- **FR-008**: The person MUST be able to mark a task done and mark it not done again.
- **FR-009**: Done tasks MUST remain visible and MUST be visually distinct from open tasks.
- **FR-010**: The person MUST be able to delete a single task without affecting the others.
- **FR-011**: Tasks, including completion status, MUST persist across refresh and a later visit until deleted.
- **FR-012**: Failed add, complete, or delete actions MUST leave existing tasks intact and MUST surface an error the person can dismiss or retry past.
- **FR-013**: The experience MUST be usable on a narrow phone screen and on a desktop screen.
- **FR-014**: Core actions MUST be completable with a keyboard, and controls MUST have accessible names.
- **FR-015**: The system MUST NOT require an account, and MUST NOT include priorities, deadlines, sharing, notifications, or editing the description.

### Key Entities

- **Task**: One personal to-do. Attributes: unique identity, description (1–200 characters after trim), done or not done, creation time. No owner in v1. Tasks are independent; identical descriptions are allowed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can add a task, mark it done, and delete it in under two minutes without instructions.
- **SC-002**: After opening the app, the list or the empty state is visible within two seconds under normal conditions.
- **SC-003**: A task added, completed, or deleted is still in that state after the page is reloaded.
- **SC-004**: 100 percent of the core journeys (see list, add, complete, delete, empty state, failed load) have a passing end-to-end check, at least five in total.
- **SC-005**: A keyboard-only pass can add, complete, delete, and retry, and an accessibility review finds zero critical barriers on those screens.
- **SC-006**: The empty, loading, and error states are each distinguishable in a single glance or by their accessible name.

## Assumptions

- One person uses one shared list on one deployment. There is no login.
- Descriptions are plain text. The same wording may be used on more than one task.
- Creation time is stored for ordering. The list is newest first. The time need not be a prominent label.
- Data is kept until the person deletes it. There is no automatic expiry.
- "Visually distinct" means a done task uses strikethrough or an equivalent status treatment plus a checked control, not color alone.
- Phone width means about 375 CSS pixels. Desktop means about 1280 CSS pixels.
- Out of scope: accounts, multiple lists, collaboration, priorities, due dates, reminders, search, filters, and editing text after creation.
- Quality targets from the training activity (automated tests, container startup, accessibility and security notes, setup documentation) apply to the delivery of this feature and are governed by the constitution.
