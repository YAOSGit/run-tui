---
title: Context Providers
teleport:
  file: src/app/providers.tsx
  line: 30
  highlight: AppProviders
actions:
  - label: View provider directory
    command: ls src/providers/
validate:
  command: test -f src/app/providers.tsx
  hint: Ensure you are in the run-tui project root
required: true
---

# Context Providers

## How it works
The `AppProviders` component composes five context providers in a strict nesting order: `LogsProvider` (log buffer), `TasksProvider` (task state + process spawning), `ViewProvider` (tab selection, scroll, search), `UIStateProvider` (overlays, display mode), and `CommandsProvider` (keyboard command dispatch).

## Data flow
A `LogsConsumer` bridge pattern (line 11) passes the `addLog` function from `LogsProvider` down to `TasksProvider` via a render prop, since `TasksProvider` needs to write logs but is nested inside `LogsProvider`.

## Key details
- This layered architecture means each concern is isolated: adding a new feature like search or compact mode only requires touching its specific provider without modifying the others.
- The nesting order is important -- providers can only consume contexts from providers above them in the tree.
