export const TEXT_ERROR = "Description must be 1-200 characters.";
export const COMPLETED_ERROR = "Completed must be true or false.";
export const NOT_FOUND = "Task not found.";
export const TEXT_MAX = 200;

export function normalizeText(value) {
  if (typeof value !== "string") return { error: TEXT_ERROR };
  const text = value.trim();
  if (text.length < 1 || text.length > TEXT_MAX) return { error: TEXT_ERROR };
  return { text };
}

export function parseId(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

export function rowToTodo(row) {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

const SELECT_ONE =
  "SELECT id, text, completed, created_at FROM todos WHERE id = ?";

export function listTodos(db) {
  const rows = db
    .prepare(
      "SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC, id DESC",
    )
    .all();
  return rows.map(rowToTodo);
}

export function createTodo(db, input) {
  const normalized = normalizeText(input?.text);
  if (normalized.error) return { error: normalized.error, status: 400 };
  const createdAt = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)")
    .run(normalized.text, createdAt);
  const row = db.prepare(SELECT_ONE).get(result.lastInsertRowid);
  return { todo: rowToTodo(row), status: 201 };
}

export function updateTodo(db, id, input) {
  if (!Number.isInteger(id) || id < 1) return { error: NOT_FOUND, status: 404 };
  if (typeof input?.completed !== "boolean") {
    return { error: COMPLETED_ERROR, status: 400 };
  }
  const existing = db.prepare("SELECT id FROM todos WHERE id = ?").get(id);
  if (!existing) return { error: NOT_FOUND, status: 404 };
  db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(
    input.completed ? 1 : 0,
    id,
  );
  return { todo: rowToTodo(db.prepare(SELECT_ONE).get(id)), status: 200 };
}

export function deleteTodo(db, id) {
  if (!Number.isInteger(id) || id < 1) return { error: NOT_FOUND, status: 404 };
  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  if (result.changes === 0) return { error: NOT_FOUND, status: 404 };
  return { status: 204 };
}
