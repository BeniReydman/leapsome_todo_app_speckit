# Data Model: Personal Todo List

## Task

One personal to-do. Tasks do not belong to a user in v1. Identity is a positive integer so a user column can be added later without changing the public shape of existing fields.

| Field | Type | Rules |
| --- | --- | --- |
| id | integer | Primary key, assigned by the database, always ≥ 1 |
| text | string | Required. Trim leading and trailing whitespace before save. Length after trim is 1–200 characters. Stored value is the trimmed string. |
| completed | boolean | Required. New tasks start `false`. Updated only through the complete action. |
| created_at | timestamp | Required. Set once at creation, ISO-8601 UTC. Never updated. List order is `created_at` descending, then `id` descending. |

## Relationships

None in v1. A future user id would be a nullable-then-required column; this version does not add it.

## State

`completed` flips between false and true. There is no archive state. Deleting a task removes the row. There is no soft delete.

## Validation errors

- Missing, non-string, empty, or over-200 `text` on create: reject, do not insert.
- Missing or non-boolean `completed` on update: reject, do not change the row.
- Update or delete of an unknown id: reject as not found, do not change other rows.
