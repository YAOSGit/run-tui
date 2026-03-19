---
title: Split Pane & Pinning
teleport:
  file: src/components/TabBar/index.tsx
  line: 50
  highlight: TabBar
actions:
  - label: View pin toggle command
    command: cat src/commands/togglePin/index.ts
validate:
  command: test -f src/components/TabBar/index.tsx
  hint: Ensure you are in the run-tui project root
required: true
---

# Split Pane & Pinning

## The problem
When monitoring multiple tasks, switching between tabs means you lose sight of one task's output while viewing another. You need a way to watch two tasks simultaneously.

## The solution
When a task is pinned, it appears in a secondary `SplitPane` below the primary log view (see `app.tsx` line 350). The split view uses a 50/50 ratio with independent scroll, letting you monitor two tasks simultaneously. Pinned tasks show a pin emoji prefix and are visually distinguished in the tab bar.

## How it works
The `TabBar` component renders the task tabs with smart overflow handling. It calculates how many tabs fit in the available terminal width using `estimateTabWidth` (line 19), then shows scroll arrows when tabs overflow. The active tab always stays visible, with the viewport expanding outward from it. Each tab displays the task name, a `StatusIcon`, an optional stderr badge, pin indicator, restart count, and elapsed time via `TaskTime`.
