---
title: Flex Layout
teleport:
  file: src/app/app.tsx
  line: 38
  highlight: AppContent
actions:
  - label: View TUILayout usage
    command: grep -n "TUILayout" src/app/app.tsx
validate:
  command: test -f src/app/app.tsx
  hint: Ensure you are in the run-tui project root
required: true
---

# Flex Layout

## How it works
`AppContent` uses a pure flex layout powered by Ink's `Box` component and the toolkit's `TUILayout` + `SplitPane` components. There are no manual height calculations for positioning elements -- everything is driven by `flexGrow` and `flexDirection`.

## Component structure
The component assembles the UI from composable parts: a `TabBar` or compact header, a `statusBar` with task name and scroll indicator, and main content that switches between single-pane `LogView`, split-pane (two `LogView` instances inside a `SplitPane`), or `CompactView` mode.

## Key details
- Overlays (script selector, search bar, rename input) are declared as a map (line 262) and rendered by `TUILayout` when the corresponding UI state is active, keeping the main render logic clean.
- The flex approach means the layout adapts naturally to different terminal sizes without manual recalculation.
