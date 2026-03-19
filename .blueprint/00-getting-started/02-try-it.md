---
title: Try It Out
teleport:
  file: src/app/cli.tsx
  line: 175
  highlight: render
actions:
  - label: Build the project
    command: npm run build
  - label: Run with a test script
    command: node dist/cli.js --keep-alive
validate:
  command: test -f dist/cli.js
  hint: Run npm run build first to produce the dist output
required: false
---

# Try It Out

## What to do
Build the project first, then launch run-tui with `--keep-alive` to open the TUI without any scripts. From there you can press `n` to add scripts interactively via the script selector. Alternatively, run `node dist/cli.js dev test` (replacing `dev` and `test` with actual script names from your package.json) to launch multiple scripts at once.

## What to expect
Each script gets its own tab with live log output. Use the "Build the project" action above to compile, then try the keep-alive mode to explore the interface. You can navigate between tabs, scroll logs, pin tasks to a split view, and toggle compact mode.
