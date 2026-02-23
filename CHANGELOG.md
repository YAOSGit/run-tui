# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to a custom versioning scheme where the major version represents Node.js compatibility.

## [126.0.0] - 2026-02-23

### Added
- Platform utility (`utils/platform`) for robust cross-platform modifier key detection (`opt` vs `alt`)
- `shift`+`k` shortcut to Kill All Processes (`killAllCommand`)

### Changed
- Centralized command logic: extended the `Command` interface to include `footer`, `helpSection`, and `helpLabel` fields, removing hardcoded command lists from `CommandsProvider`, `Footer`, and `HelpMenu`
- `HelpMenu` styling: now horizontally centers and stretches to the full terminal width
- `HelpMenu` layout: dynamically hides the log view when open to allow the menu to consume its natural vertical space without explicit line budgeting
- Compact mode: dynamically sizes its vertical height to fit task rows naturally instead of expanding to fill the terminal
- Compact mode: automatically unpins tasks before switching to prevent split-pane UI artifacts from remaining active in the background
- Focus mode: reclaims vertical space by accurately removing the footer height reservation from the layout calculation
- Refactored `opt`+`letter`/`alt`+`letter` commands (e.g. `opt`+`m`, `opt`+`p`, `opt`+`f`) to correctly map to `{ meta: true }` on non-macOS environments

### Fixed
- Replaced compilation-time non-null assertions with runtime optional chaining / nullish coalescing to resolve Biome styling warnings
- Fixed unreachable code, unused imports, and non-exhaustive React hook dependency warnings across `useView`, `CommandsProvider`, and `app.tsx`
- Restored non-breaking spaces uniformly across display strings for terminal layout consistency and unit test correctness
## [125.2.1] - 2025-12-17

### Added
- End-to-end (E2E) test suite using node-pty for realistic terminal testing
  - CLI arguments tests
  - Keyboard interaction tests
  - Process lifecycle tests
  - State transition tests
- New dependencies: `node-pty` and `strip-ansi` for E2E testing

### Changed
- Reorganized test configuration with separate vitest configs:
  - `vitest.unit.config.ts` - Unit tests
  - `vitest.react.config.ts` - React component tests
  - `vitest.type.config.ts` - TypeScript type tests
  - `vitest.e2e.config.ts` - End-to-end tests
- Updated test scripts in package.json for better test organization
- Improved useProcessManager hook implementation

### Documentation
- Updated README with comprehensive keyboard shortcuts including scroll commands
- Updated project structure to reflect new architecture (providers, commands, hooks)
- Updated testing scripts documentation to reflect new test organization

## [125.2.0] - 2025-12-16

### Added
- Scroll commands for navigating log output
- Additional test coverage for commands (closeTab, filter, kill, navigation, newScript, quit, restart, scroll)
- Footer component tests
- useLogs hook tests

### Changed
- Enhanced `estimateTabWidth` function in TabBar component to account for stderr badge width, improving tab width calculations
- Improved App component with extended functionality

## [125.1.1] - 2025-12-15

### Changed
- Enhanced LogView component to improve divider formatting in logs
- Updated demo recordings using asciinema

### Documentation
- Updated README to reflect transition from Terminalizer to asciinema for demo recordings
- Added updated installation instructions and usage examples for asciinema

### Removed
- Removed Terminalizer configuration files and related directories

## [125.0.1] - 2025-12-13

### Added
- CLI version injection at build time
- Command registry system with new hook `useCommandRegistry`
- New commands module with organized command structure:
  - `closeTab` - Close current tab
  - `filter` - Filter log output
  - `kill` - Kill running process
  - `navigation` - Tab navigation commands
  - `newScript` - Add new script to run
  - `quit` - Quit application
  - `restart` - Restart process
- `ConfirmDialog` component for confirmation dialogs
- `ScriptSelector` component for selecting scripts to run
- New type definitions:
  - `Command`
  - `CommandContext`
  - `KeyBinding`
  - `PendingConfirmation`
  - `VisibleCommand`
- Support for script addition and improved task management in App component
- New key commands documented in README
- Test suite for version 125.0.1

### Changed
- Refactored App component to support script addition and improved task management
- Enhanced Footer component with updated types and functionality
- Improved LogView component with new log type support
- Enhanced TabBar component with better tab management
- Refactored imports and improved code formatting across multiple files for better readability and consistency
- Enhanced useProcessManager hook with additional functionality
- Updated useTaskStates hook

### Removed
- Removed `QuitConfirm` component (replaced by generic `ConfirmDialog`)
- Removed `App.consts.ts` (moved to command registry)

## [125.0.0] - 2025-12-12

### Added
- Versioning scheme details added to README (major version = Node.js compatibility)

### Changed
- Enhanced esbuild configuration with require shim and support for Node.js built-ins
- Updated package version to new versioning scheme (125.x.x)
