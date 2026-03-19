---
title: Compact Mode
teleport:
  file: src/components/CompactView/index.tsx
  line: 17
  highlight: CompactView
actions:
  - label: View display mode command
    command: cat src/commands/displayMode/index.ts
validate:
  command: test -f src/components/CompactView/index.tsx
  hint: Ensure you are in the run-tui project root
required: false
---

# Compact Mode

## The problem
With many running tasks, the tabbed log view only shows one task at a time. You need a quick overview of all task statuses without switching through every tab.

## The solution
`CompactView` replaces the full log view with a summary list showing all tasks at once. Each row displays the task status, name, elapsed time, and the last log line -- giving you a quick overview without switching tabs.

## How it works
The component implements virtual scrolling with a viewport that follows the active tab index (line 29). When there are more tasks than `maxVisible` lines, the viewport centers on the active task and scrolls as needed. When compact mode is active, the header switches from `TabBar` to a simple breadcrumb showing "Compact > N tasks > active task name" (see `app.tsx` line 235). Toggle between normal and compact mode with the display mode keyboard shortcut.
