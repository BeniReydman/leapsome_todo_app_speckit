async function request(path, options = {}) {
  const headers = options.body ? { "content-type": "application/json" } : {};
  const response = await fetch(path, { ...options, headers });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return body;
}

export function fetchTodos() {
  return request("/api/todos");
}

export function createTodo(text) {
  return request("/api/todos", { method: "POST", body: JSON.stringify({ text }) });
}

export function updateTodo(id, completed) {
  return request(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

export function deleteTodo(id) {
  return request(`/api/todos/${id}`, { method: "DELETE" });
}
