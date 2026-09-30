# Contract: Todos API

Base path: `/api`. JSON in and out. Unknown routes return 404 with `{ "error": "Not found" }`.

## Todo

```json
{
  "id": 1,
  "text": "Buy milk",
  "completed": false,
  "createdAt": "2026-09-30T17:00:00.000Z"
}
```

`text` is the trimmed description (1–200 characters). `completed` is a boolean. `createdAt` is ISO-8601 UTC.

## GET /api/health

Response `200`:

```json
{ "status": "ok" }
```

If the database cannot answer `SELECT 1`, response `503`:

```json
{ "status": "error" }
```

## GET /api/todos

Response `200`:

```json
{ "todos": [] }
```

`todos` is newest first (`createdAt` descending, then `id` descending).

## POST /api/todos

Request:

```json
{ "text": "Buy milk" }
```

Response `201`:

```json
{ "todo": { "id": 1, "text": "Buy milk", "completed": false, "createdAt": "2026-09-30T17:00:00.000Z" } }
```

Response `400` when `text` is missing, not a string, empty after trim, or longer than 200 characters:

```json
{ "error": "Description must be 1-200 characters." }
```

## PATCH /api/todos/:id

`:id` is a positive integer. Request:

```json
{ "completed": true }
```

Response `200`: `{ "todo": { } }` with the updated task.

Response `400` when `completed` is missing or not a boolean:

```json
{ "error": "Completed must be true or false." }
```

Response `404` when no task has that id:

```json
{ "error": "Task not found." }
```

## DELETE /api/todos/:id

Response `204` with an empty body when the task was deleted.

Response `404` when no task has that id:

```json
{ "error": "Task not found." }
```
