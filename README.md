<h1 align="center">Yet another Open Source run-tui</h1>

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
- **Log Type Filtering**: Filter logs by stdout, stderr, or show all
- **Stderr Notifications**: Visual indicator when a background tab has new stderr output
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
| `k` | Kill the current task |
| `f` | Toggle log filter (all → stdout → stderr) |
| `q` / `Esc` | Quit (with confirmation if tasks are running) |
| `y` / `n` | Confirm or cancel quit |

### CLI Options

| Option | Description |
|--------|-------------|
| `-r, --regex` | Treat arguments as regex patterns |
| `-p, --package-manager <pm>` | Package manager to use (npm, yarn, pnpm, bun) |
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
| `npm test` | Run tests once with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run ui:vitest` | Open Vitest UI with coverage |
| `npm run coverage` | Run tests with coverage report |
| `npm run validate` | Run type checking + linting + tests |

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
│   ├── cli.tsx                 # CLI entry point
│   ├── components/             # React components
│   │   ├── App/                # Main application component
│   │   ├── TabBar/             # Tab navigation
│   │   ├── LogView/            # Log display area
│   │   ├── Footer/             # Status bar and shortcuts
│   │   └── QuitConfirm/        # Quit confirmation dialog
│   ├── hooks/                  # Custom React hooks
│   │   ├── useProcessManager/  # Process spawning and management
│   │   ├── useLogs/            # Log storage and filtering
│   │   └── useTaskStates/      # Task status tracking
│   └── types/                  # TypeScript type definitions
├── dist/                       # Built output
├── biome.json                  # Biome configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
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

## License

ISC
