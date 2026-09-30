import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api.js";

vi.mock("./api.js", () => ({
  fetchTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

describe("App", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows a loading state and then the empty state", async () => {
    let resolve;
    fetchTodos.mockReturnValue(new Promise((done) => { resolve = done; }));
    render(<App />);
    expect(screen.getByRole("status").textContent).toBe("Loading tasks…");
    expect(screen.queryByText("No tasks yet. Add one below.")).toBeNull();
    resolve({ todos: [] });
    expect(await screen.findByText("No tasks yet. Add one below.")).toBeTruthy();
  });

  it("lists saved tasks", async () => {
    fetchTodos.mockResolvedValue({
      todos: [{ id: 2, text: "Newer", completed: false }, { id: 1, text: "Older", completed: true }],
    });
    render(<App />);
    expect(await screen.findByRole("checkbox", { name: "Newer" })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Older" }).closest("li").className).toBe("done");
    expect(screen.getByRole("checkbox", { name: "Older" }).checked).toBe(true);
  });

  it("shows a load error and retries", async () => {
    fetchTodos.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce({ todos: [] });
    render(<App />);
    expect((await screen.findByRole("alert")).textContent).toContain("Could not load tasks.");
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("No tasks yet. Add one below.")).toBeTruthy();
  });

  it("adds a task and refuses blank or oversized text", async () => {
    fetchTodos.mockResolvedValue({ todos: [] });
    createTodo.mockResolvedValue({
      todo: { id: 3, text: "Buy milk", completed: false, createdAt: "2026-09-30T00:00:00.000Z" },
    });
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("No tasks yet. Add one below.");

    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(screen.getByRole("alert").textContent).toBe("Description must be 1-200 characters.");

    fireEvent.change(screen.getByLabelText("Task description"), {
      target: { value: "a".repeat(201) },
    });
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(createTodo).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Task description"));
    await user.type(screen.getByLabelText("Task description"), "  Buy milk  ");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(createTodo).toHaveBeenCalledWith("Buy milk");
    expect(await screen.findByRole("checkbox", { name: "Buy milk" })).toBeTruthy();
  });

  it("marks a task done and deletes it", async () => {
    fetchTodos.mockResolvedValue({
      todos: [{ id: 4, text: "Walk", completed: false, createdAt: "2026-09-30T00:00:00.000Z" }],
    });
    updateTodo.mockResolvedValue({
      todo: { id: 4, text: "Walk", completed: true, createdAt: "2026-09-30T00:00:00.000Z" },
    });
    deleteTodo.mockResolvedValue(null);
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("checkbox", { name: "Walk" }));
    expect(updateTodo).toHaveBeenCalledWith(4, true);
    expect((await screen.findByRole("checkbox", { name: "Walk" })).closest("li").className).toBe("done");

    await user.click(screen.getByRole("button", { name: "Delete Walk" }));
    expect(await screen.findByText("No tasks yet. Add one below.")).toBeTruthy();
  });

  it("keeps the list when a change fails and reloads on 404", async () => {
    fetchTodos.mockResolvedValue({
      todos: [{ id: 5, text: "Stay", completed: false, createdAt: "2026-09-30T00:00:00.000Z" }],
    });
    const missing = new Error("Task not found.");
    missing.status = 404;
    updateTodo.mockRejectedValueOnce(new Error("Could not save."));
    deleteTodo.mockRejectedValueOnce(missing);
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("checkbox", { name: "Stay" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Could not save.");
    expect(screen.getByRole("checkbox", { name: "Stay" })).toBeTruthy();

    fetchTodos.mockResolvedValueOnce({ todos: [] });
    await user.click(screen.getByRole("button", { name: "Delete Stay" }));
    expect(await screen.findByText("No tasks yet. Add one below.")).toBeTruthy();
  });

  it("shows an add failure without dropping the list", async () => {
    fetchTodos.mockResolvedValue({ todos: [] });
    createTodo.mockRejectedValue(new Error("Could not save."));
    const user = userEvent.setup();
    render(<App />);
    await screen.findByLabelText("Task description");
    await user.type(screen.getByLabelText("Task description"), "Later");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Could not save.");
    expect(screen.getByText("No tasks yet. Add one below.")).toBeTruthy();
  });
});
