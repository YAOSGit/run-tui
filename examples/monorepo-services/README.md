# Integration Example

A full integration demo showcasing all run-tui capabilities with 10 scripts that simulate a realistic monorepo development environment.

## Scripts

| Script        | Description                      | Type         |
|---------------|----------------------------------|--------------|
| `dev:server`  | API server with simulated traffic | Long-running |
| `dev:worker`  | Background job processor          | Long-running |
| `build`       | Production build pipeline         | One-shot     |
| `test:unit`   | Unit test suite (7 suites)        | One-shot     |
| `test:e2e`    | End-to-end test suite (5 flows)   | One-shot     |
| `lint`        | Biome linter                      | One-shot     |
| `typecheck`   | TypeScript type checker           | One-shot     |
| `storybook`   | Component dev server              | Long-running |
| `codegen`     | API schema type generation        | One-shot     |
| `db:migrate`  | Database migration runner         | One-shot     |

## Usage

### Run both dev processes

```bash
run-tui dev:server dev:worker
```

### Regex match all dev scripts

```bash
run-tui -r "^dev:"
```

### Run all test suites

```bash
run-tui -r "^test:"
```

### Run everything

```bash
run-tui -r ".*"
```

### Use a different package manager

```bash
run-tui -p pnpm dev:server dev:worker
run-tui -p bun -r "^test:"
```

### Restart on failure

```bash
run-tui --restart-on-failure dev:server dev:worker
```

## Keyboard Shortcuts

| Key      | Action                          |
|----------|---------------------------------|
| `←` `→` | Navigate between script tabs    |
| `k`      | Kill the focused script         |
| `r`      | Restart the focused script      |
| `/`      | Search within script output     |
| `m`      | Toggle compact mode             |
| `s`      | Toggle split pane view          |
| `p`      | Pin a script tab                |
| `ctrl+o` | Export logs to file             |
| `f`      | Filter script output            |

## Suggested Workflows

**Full CI check** -- run all validation scripts at once:

```bash
run-tui build lint typecheck test:unit test:e2e
```

**Development mode** -- run long-lived services side by side:

```bash
run-tui dev:server dev:worker storybook
```

**Pre-deploy** -- build, migrate, and verify:

```bash
run-tui build db:migrate codegen
```
