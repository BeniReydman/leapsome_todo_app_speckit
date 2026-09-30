# Accessibility

Checked on 2026-09-30 with `@axe-core/playwright` against the running UI, and by using the screen in a browser.

## Axe

Axe reported **zero violations** (including critical, serious, moderate, and minor) on:

- the empty state
- a list with one completed task

The Playwright test fails if any violation has impact `critical` or `serious`. That test passed. A separate run printed the full violation list for both screens: `[]`.

## What the UI does

- Page language is `en`. The title is "Tasks".
- The description field has a visible label.
- Each task checkbox is named by the task text. Delete is named `Delete` plus the task text.
- Loading uses `role="status"`. Errors use `role="alert"`.
- Done tasks use a checked box and strikethrough, not color alone.
- Buttons meet a 44px minimum height. Focus uses a 3px outline.
- At 375px width the row stacks and Delete spans the card. Confirmed in the browser on the compose UI.

## Residual

Axe does not replace a screen-reader pass. Keyboard use is covered by native controls (text field, submit, checkbox, buttons). No custom keyboard handler was added.
