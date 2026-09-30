<!--
Sync Impact Report
- Version change: unratified template → 1.0.0
- Modified principles: placeholders replaced with the five principles below
- Added sections: Delivery Constraints, Quality Gates
- Removed sections: none (template placeholders only)
- Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Spec Before Code

Every user-facing change MUST trace to a Spec Kit specification, plan, and
task list before implementation starts. Agents MUST treat `spec.md` as the
source of behavior and `plan.md` as the source of technical choices. Code that
cannot be mapped to a task in `tasks.md` is out of scope for that change.

### II. Smallest Complete Product

The product MUST deliver create, view, complete, and delete for a single
personal task list, and nothing else in the first version. Accounts,
collaboration, priorities, deadlines, notifications, and inline editing are
out of scope until a new specification says otherwise. Prefer the standard
library and already-chosen dependencies over new packages.

### III. Tests With the Feature

Each user story MUST ship with the tests that prove it: unit tests for
rules, integration tests for the API, and end-to-end tests for the user
journey. A story is not done when only the happy path is covered. Meaningful
line coverage of application code MUST stay at or above 70 percent.

### IV. Clear and Accessible Interaction

The interface MUST work with keyboard alone, name every control, and meet
WCAG 2.2 AA for the screens in scope. Completed tasks MUST be visually
distinct from active ones. Empty, loading, and error states MUST be explicit.
The layout MUST remain usable at phone width and desktop width.

### V. Runnable by Default

A new developer MUST be able to start the full application with
`docker compose up`. Images MUST use multi-stage builds and a non-root user.
The API MUST expose a health check that compose uses. Dev and test
environments MUST be selectable with environment variables and compose
profiles without changing source code.

## Delivery Constraints

- One shared task list. No authentication in v1. The data model MUST NOT
  block adding a user identity later.
- Task text is required, trimmed, and limited to 200 characters.
- Tasks persist across refresh and process restart until the user deletes them.
- The client and server MUST reject invalid input and MUST show a recoverable
  error when persistence or the network fails.
- User-supplied text MUST be treated as data, never as markup or a query.

## Quality Gates

A change is ready only when all of the following hold:

- Unit, integration, and end-to-end suites pass.
- At least five end-to-end tests cover create, complete, delete, empty state,
  and error handling.
- Coverage of application code is at least 70 percent.
- Accessibility check reports zero critical WCAG violations.
- `docker compose up` serves the UI and the API, and health checks pass.
- README explains setup. An AI integration log records what the agent did,
  which tools helped, and where a person still had to judge.

## Governance

This constitution supersedes ad-hoc practice for this repository. Amendments
require an edit to this file, a semantic version bump, and an updated
ratification note. MAJOR bumps remove or redefine a principle. MINOR bumps add
a principle or a gate. PATCH bumps clarify wording.

Reviews MUST check the constitution gates before calling a story done.
Complexity beyond this document MUST be justified in the plan's Complexity
Tracking table. Day-to-day guidance lives in `specs/001-personal-todo/`.

**Version**: 1.0.0 | **Ratified**: 2026-09-30 | **Last Amended**: 2026-09-30
