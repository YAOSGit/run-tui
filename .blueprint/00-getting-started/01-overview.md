---
title: What is run-tui?
teleport:
  file: src/app/cli.tsx
  line: 16
  highlight: runTUI
actions:
  - label: View help
    command: node dist/cli.js --help
validate:
  command: test -f src/app/cli.tsx
  hint: Make sure you are in the run-tui project root
required: true
---

# What is run-tui?

## What it does
run-tui is an interactive TUI for running multiple npm scripts concurrently. It reads `package.json` from the current directory, spawns the requested scripts as child processes, and provides a tabbed interface with live log streaming.

## How it works
The `runTUI` function parses CLI arguments (script names, regex patterns, package manager selection, restart config) and renders the Ink-based React app. It supports `--regex` for pattern-matching script names, `--keep-alive` to stay open with no scripts, and `--restart-on-failure` for automatic retry with configurable delay and max attempts.

## Key concepts
- Scripts are spawned as child processes with stdout/stderr captured and streamed to the TUI.
- The `--` separator forwards extra arguments to the underlying scripts (with `--` re-injected for npm compatibility).
- Each script gets its own tab with independent log scrolling.
