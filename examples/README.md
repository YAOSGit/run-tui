# run-tui Examples

This folder contains example projects for demonstrating `run-tui` features and instructions for recording demo GIFs.

## Example Projects

### basic-project

A minimal Node.js project with scripts that simulate common development tasks:

| Script | Description |
|--------|-------------|
| `dev` | Simulates a dev server with file watching |
| `build` | Simulates a build process that completes |
| `test` | Simulates test runner output |
| `lint` | Simulates linting output |

### Running the Examples

```bash
# From the run-tui root directory, first build run-tui
npm run build

# Then run the example with run-tui
./dist/cli.js -p npm dev build test lint

# Or with regex
./dist/cli.js -p npm -r ".*"
```

## Recording Demos with Terminalizer

The `terminalizer/` folder contains configuration for recording terminal demos.

### Prerequisites

Install Terminalizer globally:

```bash
yarn global add terminalizer
# or
npm install -g terminalizer
```

### Recording a Demo

1. Navigate to the examples folder:
   ```bash
   cd examples
   ```

2. Start recording:
   ```bash
   terminalizer record terminalizer/recordings/demo -c terminalizer/terminalizer.yml
   ```

3. Run your demo commands:
   ```bash
   cd basic-project
   ../../dist/cli.js dev build test
   # Use arrow keys to switch tabs, 'f' to filter, 'q' to quit
   ```

4. Press `Ctrl+D` to stop recording

### Playback

Test your recording before rendering:

```bash
terminalizer play terminalizer/recordings/demo.yml
```

Options:
- `-r, --real-timing`: Use actual recorded delays
- `-s, --speed-factor <n>`: Multiply frame delays by factor

### Rendering to GIF

```bash
terminalizer render terminalizer/recordings/demo.yml -o terminalizer/gifs/demo.gif
```

Options:
- `-q, --quality <1-100>`: Image quality (default: 80)
- `-s, --step <n>`: Reduce frame count by step value

### Post-Processing

The rendered GIFs can be large. Consider compressing them:
- [gifcompressor.com](https://gifcompressor.com/)
- [ezgif.com/optimize](https://ezgif.com/optimize)

### Suggested Demo Scenarios

1. **Basic Usage**: Run multiple scripts, switch between tabs, show log output
2. **Log Filtering**: Toggle between all/stdout/stderr filters with 'f' key
3. **Process Management**: Kill a running process with 'k', close completed tabs with 'x'
4. **Adding Scripts**: Use 'n' to add new scripts dynamically

## File Structure

```
examples/
├── basic-project/
│   ├── package.json
│   └── scripts/
│       ├── dev.js
│       ├── build.js
│       ├── test.js
│       └── lint.js
├── terminalizer/
│   ├── terminalizer.yml
│   ├── recordings/
│   └── gifs/
└── README.md
```
