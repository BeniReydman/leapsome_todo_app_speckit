import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { openDb } from "../src/db.js";
import {
  TEXT_ERROR,
  createTodo,
  deleteTodo,
  listTodos,
  normalizeText,
  parseId,
  updateTodo,
} from "../src/todos.js";

function memoryDb() {
  return openDb(":memory:");
}

describe("normalizeText", () => {
  it("trims and keeps a 200-character description", () => {
    const text = `  ${"a".repeat(200)}  `;
    expect(normalizeText(text)).toEqual({ text: "a".repeat(200) });
  });

  it("rejects empty, non-string, and 201-character descriptions", () => {
    expect(normalizeText("   ").error).toBe(TEXT_ERROR);
    expect(normalizeText(12).error).toBe(TEXT_ERROR);
    expect(normalizeText("a".repeat(201)).error).toBe(TEXT_ERROR);
  });
});

describe("parseId", () => {
  it("accepts positive integers and rejects everything else", () => {
    expect(parseId("1")).toBe(1);
    expect(parseId("0")).toBeNull();
    expect(parseId("01")).toBeNull();
    expect(parseId("1.5")).toBeNull();
    expect(parseId("nope")).toBeNull();
  });
});

describe("todo store", () => {
  it("creates, lists newest first, completes, and deletes", () => {
    const db = memoryDb();
    const first = createTodo(db, { text: "  older  " });
    const second = createTodo(db, { text: "newer" });
    expect(first.status).toBe(201);
    expect(first.todo.completed).toBe(false);
    expect(first.todo.text).toBe("older");
    expect(listTodos(db).map((todo) => todo.text)).toEqual(["newer", "older"]);

    const done = updateTodo(db, second.todo.id, { completed: true });
    expect(done.todo.completed).toBe(true);
    const reopened = updateTodo(db, second.todo.id, { completed: false });
    expect(reopened.todo.completed).toBe(false);

    expect(deleteTodo(db, first.todo.id).status).toBe(204);
    expect(listTodos(db)).toHaveLength(1);
    expect(deleteTodo(db, first.todo.id)).toEqual({ error: "Task not found.", status: 404 });
  });

  it("stores text that looks like SQL as data", () => {
    const db = memoryDb();
    const payload = "'; DROP TABLE todos;--";
    createTodo(db, { text: payload });
    expect(listTodos(db)[0].text).toBe(payload);
    expect(db.prepare("SELECT COUNT(*) AS n FROM todos").get().n).toBe(1);
  });

  it("rejects bad updates without changing other rows", () => {
    const db = memoryDb();
    const created = createTodo(db, { text: "keep" });
    expect(updateTodo(db, 0, { completed: true }).status).toBe(404);
    expect(updateTodo(db, created.todo.id, {}).status).toBe(400);
    expect(updateTodo(db, 99, { completed: true }).status).toBe(404);
    expect(listTodos(db)[0].completed).toBe(false);
  });

  it("rejects a bad create", () => {
    const db = new DatabaseSync(":memory:");
    db.exec("CREATE TABLE todos (id INTEGER PRIMARY KEY, text TEXT, completed INTEGER, created_at TEXT)");
    expect(createTodo(db, {}).status).toBe(400);
    expect(deleteTodo(db, 0).status).toBe(404);
  });
});
