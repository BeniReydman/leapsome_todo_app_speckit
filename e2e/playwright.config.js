import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.js",
  workers: 1,
  use: { baseURL },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : [
        {
          command: "npm start --prefix ../backend",
          env: { ...process.env, PORT: "3000", DB_PATH: "/tmp/leapsome-todo-e2e.sqlite" },
          url: "http://127.0.0.1:3000/api/health",
          reuseExistingServer: false,
          timeout: 30_000,
        },
        {
          command: "npm run dev --prefix ../frontend -- --host 127.0.0.1 --port 5173",
          url: "http://127.0.0.1:5173",
          reuseExistingServer: false,
          timeout: 30_000,
        },
      ],
});
