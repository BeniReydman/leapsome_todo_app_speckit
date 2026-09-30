import { afterEach, describe, expect, it } from "vitest";
import { openDb } from "../src/db.js";
import { buildApp, start } from "../src/server.js";

async function appWith(db = openDb(":memory:")) {
  const app = buildApp(db);
  await app.ready();
  return app;
}

describe("todos API", () => {
  const servers = [];

  afterEach(async () => {
    await Promise.all(servers.splice(0).map((app) => app.close()));
  });

  it("reports health and an empty list", async () => {
    const app = await appWith();
    servers.push(app);
    const health = await app.inject({ method: "GET", url: "/api/health" });
    expect(health.json()).toEqual({ status: "ok" });
    const list = await app.inject({ method: "GET", url: "/api/todos" });
    expect(list.json()).toEqual({ todos: [] });
  });

  it("returns 503 when the database check fails", async () => {
    const app = await appWith({
      prepare() {
        throw new Error("db down");
      },
    });
    servers.push(app);
    const health = await app.inject({ method: "GET", url: "/api/health" });
    expect(health.statusCode).toBe(503);
    expect(health.json()).toEqual({ status: "error" });
  });

  it("creates, completes, reopens, and deletes a task", async () => {
    const app = await appWith();
    servers.push(app);
    const created = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: { text: "  Buy milk  " },
    });
    expect(created.statusCode).toBe(201);
    const todo = created.json().todo;
    expect(todo.text).toBe("Buy milk");
    expect(todo.completed).toBe(false);

    const done = await app.inject({
      method: "PATCH",
      url: `/api/todos/${todo.id}`,
      payload: { completed: true },
    });
    expect(done.statusCode).toBe(200);
    expect(done.json().todo.completed).toBe(true);

    const reopened = await app.inject({
      method: "PATCH",
      url: `/api/todos/${todo.id}`,
      payload: { completed: false },
    });
    expect(reopened.json().todo.completed).toBe(false);

    const removed = await app.inject({ method: "DELETE", url: `/api/todos/${todo.id}` });
    expect(removed.statusCode).toBe(204);
    expect(removed.body).toBe("");
    const list = await app.inject({ method: "GET", url: "/api/todos" });
    expect(list.json().todos).toEqual([]);
  });

  it("rejects invalid descriptions and completion flags", async () => {
    const app = await appWith();
    servers.push(app);
    const blank = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: { text: "   " },
    });
    expect(blank.statusCode).toBe(400);
    expect(blank.json().error).toBe("Description must be 1-200 characters.");

    const tooLong = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: { text: "a".repeat(201) },
    });
    expect(tooLong.statusCode).toBe(400);

    const created = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: { text: "a".repeat(200) },
    });
    expect(created.statusCode).toBe(201);

    const badFlag = await app.inject({
      method: "PATCH",
      url: `/api/todos/${created.json().todo.id}`,
      payload: { completed: "yes" },
    });
    expect(badFlag.statusCode).toBe(400);
    expect(badFlag.json().error).toBe("Completed must be true or false.");
  });

  it("returns 404 for missing tasks and unknown routes", async () => {
    const app = await appWith();
    servers.push(app);
    const missing = await app.inject({
      method: "DELETE",
      url: "/api/todos/9",
    });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error).toBe("Task not found.");

    const badId = await app.inject({
      method: "PATCH",
      url: "/api/todos/nope",
      payload: { completed: true },
    });
    expect(badId.statusCode).toBe(404);

    const unknown = await app.inject({ method: "GET", url: "/missing" });
    expect(unknown.statusCode).toBe(404);
    expect(unknown.json()).toEqual({ error: "Not found" });
  });

  it("listens on the requested port", async () => {
    const app = await start({ DB_PATH: ":memory:", PORT: "0" });
    servers.push(app);
    const address = app.server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    expect(response.status).toBe(200);
  });
});
