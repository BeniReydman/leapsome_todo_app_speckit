import { useEffect, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api.js";

const TEXT_ERROR = "Description must be 1-200 characters.";

export function App() {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [draft, setDraft] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  async function load() {
    setStatus("loading");
    setActionError("");
    try {
      const data = await fetchTodos();
      setTodos(data.todos);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(event) {
    event.preventDefault();
    const text = draft.trim();
    if (text.length < 1 || text.length > 200) {
      setFormError(TEXT_ERROR);
      return;
    }
    setFormError("");
    try {
      const data = await createTodo(text);
      setTodos((current) => [data.todo, ...current]);
      setDraft("");
      setActionError("");
    } catch (error) {
      setActionError(error.message);
    }
  }

  async function onToggle(todo) {
    try {
      const data = await updateTodo(todo.id, !todo.completed);
      setTodos((current) => current.map((item) => (item.id === todo.id ? data.todo : item)));
      setActionError("");
    } catch (error) {
      setActionError(error.message);
      if (error.status === 404) load();
    }
  }

  async function onDelete(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
      setActionError("");
    } catch (error) {
      setActionError(error.message);
      if (error.status === 404) load();
    }
  }

  return (
    <main>
      <h1>Tasks</h1>
      {status === "loading" && <p role="status">Loading tasks…</p>}
      {status === "error" && (
        <div role="alert">
          <p>Could not load tasks.</p>
          <button type="button" onClick={load}>
            Retry
          </button>
        </div>
      )}
      {status === "ready" && (
        <>
          {todos.length === 0 && <p>No tasks yet. Add one below.</p>}
          <form onSubmit={onAdd}>
            <label htmlFor="task-text">Task description</label>
            <input
              id="task-text"
              name="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoComplete="off"
            />
            <button type="submit">Add task</button>
            {formError && <p role="alert">{formError}</p>}
          </form>
          {actionError && <p role="alert">{actionError}</p>}
          {todos.length > 0 && (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? "done" : undefined}>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => onToggle(todo)}
                    />
                    <span>{todo.text}</span>
                  </label>
                  <button type="button" onClick={() => onDelete(todo)}>
                    Delete <span className="visually-hidden">{todo.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
