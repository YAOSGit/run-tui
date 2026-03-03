# Custom Example

This example demonstrates advanced run-tui features with 6 scripts covering a realistic development workflow.

## Scripts

| Script      | Description                  | Type       |
|-------------|------------------------------|------------|
| `dev`       | Dev server with HMR          | Long-running |
| `build`     | TypeScript + esbuild bundle  | One-shot   |
| `test`      | Test suite runner            | One-shot   |
| `lint`      | Code style checker           | One-shot   |
| `typecheck` | TypeScript type checker      | One-shot   |
| `format`    | Code formatter (Biome)       | One-shot   |

## Usage

### Run specific scripts

```bash
run-tui dev build test
```

### Regex matching

Run all scripts:

```bash
run-tui -r ".*"
```

Run only dev and test:

```bash
run-tui -r "^(dev|test)$"
```

### Passthrough arguments

Pass extra arguments to a script (everything after `--`):

```bash
run-tui test -- --watch
```

### Package manager flag

Use a different package manager (default is npm):

```bash
run-tui -p bun dev
run-tui -p pnpm build test
```

## Keyboard Shortcuts

| Key   | Action                        |
|-------|-------------------------------|
| `←→`  | Navigate between script tabs |
| `k`   | Kill the focused script      |
| `r`   | Restart the focused script   |
| `/`   | Search within script output  |
| `m`   | Toggle compact mode          |
| `s`   | Toggle split pane view       |
| `p`   | Pin a script tab             |
| `ctrl+o` | Export logs              |
| `f`   | Filter script output         |
