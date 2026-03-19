---
title: Process Manager
teleport:
  file: src/hooks/useProcessManager/index.ts
  line: 22
  highlight: useProcessManager
actions:
  - label: Run tests
    command: npx vitest run src/hooks/useProcessManager/useProcessManager.test.tsx
validate:
  command: test -f src/hooks/useProcessManager/index.ts
  hint: Ensure you are in the run-tui project root
required: true
---

# Process Manager

## How it works
The `useProcessManager` hook manages the full child process lifecycle. It spawns processes with `node:child_process.spawn` (line 81), tracks them in refs (`childProcesses`, `spawnedTasks`, `killedTasks`), and handles stdout/stderr streaming into the log system.

## Kill strategy
Kill uses a SIGTERM-then-SIGKILL escalation pattern: `killProcess` (line 236) first sends SIGTERM to the process group (`-pid`), then sets a timeout that escalates to SIGKILL if the process does not exit within `KILL_TIMEOUT_MS`. This ensures clean shutdown while preventing zombie processes.

## Restart behavior
Automatic restart on failure is handled by `handleTaskFailure` (line 124), which checks restart config (enabled, exit codes, max attempts) and schedules a delayed respawn via `setTimeout`. Restart counts are tracked per-task and reset on manual kill.
