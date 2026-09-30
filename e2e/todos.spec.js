import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.get("/api/todos");
  const { todos } = await response.json();
  for (const todo of todos) {
    await request.delete(`/api/todos/${todo.id}`);
  }
});

test("shows the empty state", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("No tasks yet. Add one below.")).toBeVisible();
});

test("creates a task and keeps it after refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Task description").fill("Buy milk");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Buy milk" })).not.toBeChecked();
});

test("marks a task done and not done", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Task description").fill("Walk");
  await page.getByRole("button", { name: "Add task" }).click();
  const checkbox = page.getByRole("checkbox", { name: "Walk" });
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(page.locator("li.done")).toContainText("Walk");
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Walk" })).toBeChecked();
  await page.getByRole("checkbox", { name: "Walk" }).click();
  await expect(page.getByRole("checkbox", { name: "Walk" })).not.toBeChecked();
});

test("deletes a task and returns to the empty state", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Task description").fill("Temp");
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByRole("button", { name: "Delete Temp" }).click();
  await expect(page.getByText("No tasks yet. Add one below.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("No tasks yet. Add one below.")).toBeVisible();
});

test("shows an error and retries when the list cannot load", async ({ page }) => {
  await page.route("**/api/todos", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("Could not load tasks");
  await page.unroute("**/api/todos");
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("No tasks yet. Add one below.")).toBeVisible();
});

test("refuses a blank task", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByRole("alert")).toContainText("Description must be 1-200 characters.");
});

test("renders task text as text on a phone-width screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const payload = "<img src=x onerror=alert(1)>";
  const dialogs = [];
  page.on("dialog", (dialog) => dialogs.push(dialog.message()));
  await page.goto("/");
  await page.getByLabel("Task description").fill(payload);
  await page.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByRole("checkbox", { name: payload })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: payload })).toBeVisible();
  expect(dialogs).toEqual([]);
});

test("has no critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Task description").fill("Read");
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByRole("checkbox", { name: "Read" }).click();
  await expect(page.getByRole("checkbox", { name: "Read" })).toBeChecked();
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((item) => item.impact === "critical" || item.impact === "serious");
  expect(blocking).toEqual([]);
});
