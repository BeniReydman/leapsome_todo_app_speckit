# Performance

Checked on 2026-09-30 against `docker compose up` at http://127.0.0.1:8090, using the Cursor browser's Chrome DevTools protocol.

## What was measured

`Runtime.evaluate` on a navigation to the UI:

| Metric | Value |
| --- | --- |
| `domContentLoadedEventEnd` | 30 ms |
| `loadEventEnd` | 30 ms |
| Transfer size | 300 bytes (document; assets cached by that reload) |
| Navigation type | `navigate` |

The list, including a completed task with strikethrough (`text-decoration: line-through` on `li.done span`), was on screen after reload with no extra loading spinner beyond the initial request.

`Performance.getMetrics` returned an empty list. The Performance domain had not been enabled in that tab, so Navigation Timing is the number recorded here.

## Issues

None found for the local stack. The spec's bar is that the list or empty state shows within two seconds under normal conditions. This run was far under that, on the same machine as the containers.

Not measured: a cold cache over a slow network, or hundreds of tasks. The API reads one SQLite table ordered by `created_at`. That is enough for the few hundred tasks named in the plan, and it is the wrong design if the list grows much larger.
