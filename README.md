<p align="center">
  <a href="https://github.com/YAOSGit/run-tui">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/YAOSGit/.github/main/profile/images/run-tui.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/YAOSGit/.github/main/profile/images/run-tui-light.svg">
      <img src="https://raw.githubusercontent.com/YAOSGit/.github/main/profile/images/run-tui.svg" width="100%" alt="run-tui" />
    </picture>
  </a>
</p>

<p align="center">
  <strong>An interactive terminal UI for running npm scripts concurrently with real-time log viewing</strong>
</p>

<div align="center">

![Node Version](https://img.shields.io/badge/NODE-18+-16161D?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=%235FA04E)
![TypeScript Version](https://img.shields.io/badge/TYPESCRIPT-5.9-16161D?style=for-the-badge&logo=typescript&logoColor=white&labelColor=%233178C6)
![React Version](https://img.shields.io/badge/REACT-19.2-16161D?style=for-the-badge&logo=react&logoColor=black&labelColor=%2361DAFB)

![Uses Ink](https://img.shields.io/badge/INK-16161D?style=for-the-badge&logo=react&logoColor=white&labelColor=%2361DAFB)
![Uses Vitest](https://img.shields.io/badge/VITEST-16161D?style=for-the-badge&logo=vitest&logoColor=white&labelColor=%236E9F18)
![Uses Biome](https://img.shields.io/badge/BIOME-16161D?style=for-the-badge&logo=biome&logoColor=white&labelColor=%2360A5FA)

</div>

<p align="center">
  <img src="docs/asciinema/gifs/demo.gif" alt="run-tui demo" width="800">
</p>

---

## Table of Contents

### Getting Started

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)

### Development

- [Available Scripts](#available-scripts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

---

## Overview

**yaos-run-tui** is a terminal-based user interface for running multiple npm scripts simultaneously. It provides a tabbed interface where you can monitor the output of each script in real-time, switch between tasks, filter logs by type, and manage running processes—all from your terminal.

### What Makes This Project Unique

- **Interactive TUI**: Navigate between running scripts using arrow keys
- **Real-time Logs**: Watch stdout and stderr output as it happens
- **Log Filtering**: Toggle between all logs, stdout only, or stderr only
- **Process Management**: Kill individual processes or all at once
- **Regex Support**: Match multiple scripts using regex patterns
- **Multiple Package Managers**: Works with npm, yarn, pnpm, and bun

---

## Key Features

### Core Functionality

- **Tabbed Interface**: Each script runs in its own tab with status indicators
- **Live Log Streaming**: Real-time output from all running processes
- **Split View Mode**: Press `s` to split the terminal viewport horizontally, monitoring two tasks simultaneously
- **Compact View**: Press `m` to toggle a dense, single-line overview of all configured tasks with a header bar showing task count and active task
- **Tab Pinning**: Press `p` to pin high-priority tasks to the left side of the tab bar
- **Log Type Filtering**: Filter logs by stdout, stderr, or show all
- **Search in Logs**: Press `/` to interactively search log outputs using highlighting and `n`/`N` navigation
- **Toggle Timestamps**: Press `t` to dynamically display execution timings alongside your logs
- **Duplicate Tab Detection**: Warns preventing accidental double-execution of the same script
- **Exporting Logs**: Save logs to disk (`l`/`L`) or copy them directly to clipboard (`y`)
- **Clear Logs**: Instantly clear clutter from your active tab (`c`) or all tabs (`C`)
- **Fuzzy Script Finder**: Intelligently filter `package.json` scripts with typo tolerance when spawning new tabs
- **Stderr Notifications**: Visual indicator when a background tab has new stderr output
- **Auto-Restart on Failure**: Pass `--restart-on-failure` to auto-reboot crashed tasks with visual counters
- **Process Control**: Kill individual scripts or all running processes
- **Graceful Shutdown**: Confirmation prompt before killing running tasks

### Developer Experience

- **Simple CLI**: Just specify the scripts you want to run
- **Regex Patterns**: Use `-r` flag to match scripts by pattern
- **Package Manager Agnostic**: Works with npm, yarn, pnpm, or bun
- **Keyboard Shortcuts**: Fast navigation and control

---

## Installation

```bash
# Install globally from npm
npm install -g @yaos-git/run-tui

# Or install as a dev dependency
npm install -D @yaos-git/run-tui
```

### From Source

```bash
# Clone the repository
git clone https://github.com/YAOSGit/run-tui.git
cd run-tui

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

---

## Usage

### Basic Usage

```bash
# Run specific scripts
run-tui dev test

# Run scripts matching a regex pattern
run-tui -r "dev.*" "test.*"

# Use a different package manager
run-tui -p yarn dev test
run-tui -p pnpm dev test
run-tui -p bun dev test
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Switch between tabs |
| `↑` `↓` | Scroll logs up/down |
| `Page Up` / `Page Down` | Scroll logs by page |
| `Home` / `End` | Jump to top/bottom of logs |
| `n` | Add a new script to run |
| `x` | Close completed task tab |
| `k` | Kill the current task |
| `r` | Restart the current task |
| `s` | Toggle Split View mode (horizontal dual panes) |
| `Tab` | Switch active pane focus (when in Split View) |
| `p` | Toggle Tab Pinning |
| `m` | Toggle Compact View mode |
| `/` | Search logs (`n`/`N` to navigate matches) |
| `t` | Toggle log timestamps |
| `c` | Clear the active tab's logs |
| `C` | Clear all running tabs' logs |
| `l` | Export the active task's logs to a markdown file |
| `L` | Export all running tasks' logs |
| `y` | Copy active logs to clipboard (inside TUI), OR confirm quit/kill |
| `f` | Toggle log filter (all → stdout → stderr) |
| `q` / `Esc` | Quit (with confirmation if tasks are running) |

### CLI Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Display version information |
| `-r, --regex` | Treat arguments as regex patterns |
| `-p, --package-manager <pm>` | Package manager to use (npm, yarn, pnpm, bun) |
| `-k, --keep-alive` | Keep TUI open even with no scripts (allows adding scripts with `n` key) |
| `--restart-on-failure` | Automatically restart scripts that exit with non-zero codes |
| `--restart-delay <ms>` | Milliseconds to wait before restarting (default: 1000) |
| `--max-restarts <n>` | Maximum number of automated retries (default: 5) |
| `--restart-codes <codes>` | Comma-separated exit codes that trigger a restart |
| `-h, --help` | Display help information |

---

## Available Scripts

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run TypeScript in watch mode |
| `npm run dev:typescript` | Run TypeScript type checking in watch mode |
| `npm run dev:test` | Run tests in watch mode |

### Build Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Bundle the CLI with esbuild |

### Lint Scripts

| Script | Description |
|--------|-------------|
| `npm run lint` | Run type checking, linting, and formatting |
| `npm run lint:check` | Check code for linting issues with Biome |
| `npm run lint:fix` | Check and fix linting issues with Biome |
| `npm run lint:format` | Format all files with Biome |
| `npm run lint:types` | Run TypeScript type checking only |

### Testing Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests (unit, react, types, e2e) |
| `npm run test:unit` | Run unit tests |
| `npm run test:react` | Run React component tests |
| `npm run test:types` | Run TypeScript type tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run ui:vitest` | Open Vitest UI with coverage |
| `npm run coverage` | Run tests with coverage report |

---

## Tech Stack

### Core

- **[React 19](https://react.dev/)** - UI component library
- **[Ink 6](https://github.com/vadimdemedes/ink)** - React for CLIs
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Commander](https://github.com/tj/commander.js)** - CLI argument parsing

### Build & Development

- **[esbuild](https://esbuild.github.io/)** - Fast bundler
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Biome](https://biomejs.dev/)** - Linter and formatter

### UI Components

- **[@inkjs/ui](https://github.com/vadimdemedes/ink-ui)** - Ink UI components
- **[Chalk](https://github.com/chalk/chalk)** - Terminal string styling

---

## Project Structure

```
run-tui/
├── src/
│   ├── app/                    # Application entry points
│   │   ├── cli.tsx             # CLI entry point
│   │   ├── app.tsx             # Main application component
│   │   ├── providers.tsx       # Context providers composition
│   │   └── index.tsx           # App exports
│   ├── components/             # React components
│   │   ├── TabBar/             # Tab navigation
│   │   ├── LogView/            # Log display area
│   │   ├── Footer/             # Status bar and shortcuts
│   │   ├── ConfirmDialog/      # Generic confirmation dialog
│   │   └── ScriptSelector/     # Script selection UI
│   ├── commands/               # Keyboard command handlers
│   │   ├── closeTab/           # Close tab command
│   │   ├── filter/             # Log filter command
│   │   ├── kill/               # Kill process command
│   │   ├── navigation/         # Tab navigation commands
│   │   ├── newScript/          # Add new script command
│   │   ├── quit/               # Quit application command
│   │   ├── restart/            # Restart process command
│   │   └── scroll/             # Log scroll commands
│   ├── hooks/                  # Custom React hooks
│   │   ├── useProcessManager/  # Process spawning and management
│   │   ├── useLogs/            # Log storage and filtering
│   │   ├── useTasksState/      # Task status tracking
│   │   ├── useUIState/         # UI state management
│   │   └── useView/            # View/scroll state management
│   ├── providers/              # React context providers
│   │   ├── CommandsProvider/   # Command registry and execution
│   │   ├── LogsProvider/       # Log entries context
│   │   ├── TasksProvider/      # Task state context
│   │   ├── UIStateProvider/    # UI state context
│   │   └── ViewProvider/       # View state context
│   └── types/                  # TypeScript type definitions
│       ├── Command/            # Command type definitions
│       ├── KeyBinding/         # Key binding types
│       ├── LogEntry/           # Log entry types
│       ├── LogType/            # Log type constants
│       ├── PackageManager/     # Package manager types
│       ├── TaskState/          # Task state types
│       ├── TaskStatus/         # Task status constants
│       └── VisibleCommand/     # Visible command types
├── e2e/                        # End-to-end tests
│   ├── cli-args.e2e.ts         # CLI argument tests
│   ├── keyboard.e2e.ts         # Keyboard interaction tests
│   ├── process-lifecycle.e2e.ts # Process lifecycle tests
│   ├── state-transitions.e2e.ts # State transition tests
│   └── utils/                  # E2E test utilities
├── dist/                       # Built output
├── biome.json                  # Biome configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
├── vitest.unit.config.ts       # Unit test configuration
├── vitest.react.config.ts      # React test configuration
├── vitest.type.config.ts       # Type test configuration
├── vitest.e2e.config.ts        # E2E test configuration
└── package.json
```

---

## Versioning

This project uses a custom versioning scheme: `MAJORYY.MINOR.PATCH`

| Part | Description | Example |
|------|-------------|---------|
| `MAJOR` | Major version number | `1` |
| `YY` | Year (last 2 digits) | `25` for 2025 |
| `MINOR` | Minor version | `0` |
| `PATCH` | Patch version | `0` |

**Example:** `125.0.0` = Major version 1, released in 2025, minor 0, patch 0

This format allows you to quickly identify both the major version and the year of release at a glance.

---

## Style Guide

Conventions for contributing to this project. All rules are enforced by code review; Biome handles formatting and lint.

### Exports

- **Named exports only** — no `export default`. Every module uses `export function`, `export const`, or `export type`.
- **`import type`** — always use `import type` for type-only imports.
- **`.js` extensions** — all relative imports use explicit `.js` extensions (ESM requirement).

### File Structure

```
src/
├── app/              # Entry points and root component
├── commands/         # Command definitions (one per directory)
├── components/       # React components (PascalCase directories)
│   └── MyComponent/
│       ├── index.tsx
│       ├── MyComponent.types.ts
│       └── MyComponent.test.tsx
├── hooks/            # Custom hooks (camelCase directories)
│   └── useMyHook/
│       ├── index.ts
│       ├── useMyHook.types.ts
│       └── useMyHook.test.tsx
├── providers/        # React context providers (PascalCase directories)
│   └── MyProvider/
│       ├── index.tsx
│       ├── MyProvider.types.ts
│       └── MyProvider.test.tsx
├── types/            # Shared type definitions (PascalCase directories)
│   └── MyType/
│       ├── index.ts
│       └── MyType.test-d.ts
└── utils/            # Pure utility functions (camelCase directories)
    └── myUtil/
        ├── index.ts
        └── myUtil.test.ts
```

### Components & Providers

- **Components** use `function` declarations: `export function MyComponent(props: MyComponentProps) {}`
- **Providers** use `React.FC` arrow syntax: `export const MyProvider: React.FC<Props> = ({ children }) => {}`
- **Props** are defined in a co-located `.types.ts` file using the `interface` keyword.
- Components receive data via props — never read `process.stdout` or global state directly.

### Types

- Use `type` for data shapes and unions. Use `interface` for component props.
- Shared types live in `src/types/TypeName/index.ts` with a co-located `TypeName.test-d.ts`.
- Local types live in co-located `.types.ts` files — never inline in implementation files.
- No duplicate type definitions — import from the canonical source.

### Constants

- Named constants go in `.consts.ts` files (e.g., `MyComponent.consts.ts`).
- No magic numbers in implementation files — extract to named constants.

### Testing

- Every module has a co-located test file.
- Components: `ComponentName.test.tsx`
- Hooks: `hookName.test.tsx`
- Utils: `utilName.test.ts`
- Types: `TypeName.test-d.ts` (type-level tests using `expectTypeOf`/`assertType`)

---

## License

ISC
