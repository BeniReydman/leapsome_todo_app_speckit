import { afterEach, describe, expect, it, vi } from "vitest";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("api", () => {
  it("loads, creates, updates, and deletes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ todos: [] }))
      .mockResolvedValueOnce(jsonResponse({ todo: { id: 1, text: "Buy milk" } }, 201))
      .mockResolvedValueOnce(jsonResponse({ todo: { id: 1, completed: true } }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchTodos()).resolves.toEqual({ todos: [] });
    await expect(createTodo("Buy milk")).resolves.toEqual({ todo: { id: 1, text: "Buy milk" } });
    await expect(updateTodo(1, true)).resolves.toEqual({ todo: { id: 1, completed: true } });
    await expect(deleteTodo(1)).resolves.toBeNull();
    const deleteCall = fetchMock.mock.calls[3];
    expect(deleteCall[1].headers).toEqual({});
    expect(fetchMock.mock.calls[1][1].headers["content-type"]).toBe("application/json");
  });

  it("throws the server error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "Task not found." }, 404)),
    );
    await expect(fetchTodos()).rejects.toMatchObject({ message: "Task not found.", status: 404 });
  });

  it("throws a fallback when the body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    await expect(fetchTodos()).rejects.toThrow("Something went wrong.");
  });
});
