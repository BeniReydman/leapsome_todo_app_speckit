import { pathToFileURL } from "node:url";
import Fastify from "fastify";
import { healthcheck, openDb } from "./db.js";
import { createTodo, deleteTodo, listTodos, parseId, updateTodo } from "./todos.js";

function sendResult(reply, result) {
  if (result.status === 204) return reply.code(204).send();
  if (result.todo) return reply.code(result.status).send({ todo: result.todo });
  return reply.code(result.status).send({ error: result.error });
}

export function buildApp(db) {
  const app = Fastify({ logger: false });

  app.get("/api/health", async (_request, reply) => {
    try {
      healthcheck(db);
      return { status: "ok" };
    } catch {
      return reply.code(503).send({ status: "error" });
    }
  });

  app.get("/api/todos", async () => ({ todos: listTodos(db) }));

  app.post("/api/todos", async (request, reply) => {
    return sendResult(reply, createTodo(db, request.body));
  });

  app.patch("/api/todos/:id", async (request, reply) => {
    const id = parseId(request.params.id);
    return sendResult(reply, updateTodo(db, id ?? 0, request.body));
  });

  app.delete("/api/todos/:id", async (request, reply) => {
    const id = parseId(request.params.id);
    return sendResult(reply, deleteTodo(db, id ?? 0));
  });

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({ error: "Not found" });
  });

  return app;
}

export async function start(env = process.env) {
  const db = openDb(env.DB_PATH || "./data/todos.sqlite");
  const app = buildApp(db);
  await app.listen({ port: Number(env.PORT || 3000), host: "0.0.0.0" });
  return app;
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === entry) {
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
