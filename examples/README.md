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
cd examples/basic-project
../../dist/cli.js dev build test lint

# Or with regex
../../dist/cli.js -r ".*"
```

## Recording Demos with asciinema

The `asciinema/` folder contains configuration for recording terminal demos.

### Prerequisites

Install asciinema and agg (asciinema gif generator):

```bash
# macOS
brew install asciinema agg

# Linux (Ubuntu/Debian)
sudo apt install asciinema
# agg needs to be installed from releases: https://github.com/asciinema/agg/releases

# Or with pip
pip install asciinema
```

### Quick Start (Automated)

Use the `record-demo.sh` script to automate the recording process:

```bash
# Record and convert to GIF in one step
./record-demo.sh all demo

# Or run individual steps
./record-demo.sh record demo    # Record only
./record-demo.sh convert demo   # Convert to GIF
./record-demo.sh play demo      # Playback recording
```

The script will:
1. Build run-tui if needed
2. Check your terminal size (must be at least 80x24)
3. Record your session
4. Convert to GIF with optimal settings

**Important:** Manually resize your terminal to 80x24 before running the script.

### Manual Recording

1. **Set terminal size** (important for consistent recordings):

   Manually resize your terminal window to **80 columns x 24 rows**.

   Check your current size with:
   ```bash
   echo "Columns: $(tput cols), Rows: $(tput lines)"
   ```

2. Navigate to the examples folder:
   ```bash
   cd examples/basic-project
   ```

3. Start recording:
   ```bash
   asciinema rec ../asciinema/recordings/demo.cast \
     --cols 80 \
     --rows 24 \
     --idle-time-limit 2
   ```

4. Run your demo commands:
   ```bash
   ../../dist/cli.js dev build test
   # Use arrow keys to switch tabs, 'f' to filter, 'q' to quit
   ```

5. Press `Ctrl+D` or type `exit` to stop recording

### Playback

Test your recording before rendering:

```bash
asciinema play asciinema/recordings/demo.cast
```

Options:
- `-s, --speed <speed>`: Playback speed (e.g., 2 for 2x speed)
- `-i, --idle-time-limit <sec>`: Limit idle time during playback

### Converting to GIF

Use `agg` to convert the recording to a GIF:

```bash
agg asciinema/recordings/demo.cast asciinema/gifs/demo.gif \
  --font-family "JetBrains Mono,Monaco,Menlo,monospace" \
  --font-size 14 \
  --theme "1e1e1e,d4d4d4,000000,cd3131,0dbc79,e5e510,2472c8,bc3fbc,11a8cd,e5e5e5" \
  --idle-time-limit 2 \
  --fps-cap 10
```

Options:
- `--font-family`: Font to use
- `--font-size`: Font size in pixels
- `--theme`: Color theme (background,foreground,black,red,green,yellow,blue,magenta,cyan,white)
- `--speed`: Speed multiplier
- `--fps-cap`: Max frames per second
- `--idle-time-limit`: Cap long pauses

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
├── asciinema/
│   ├── asciinema.config
│   ├── agg.config
│   ├── recordings/
│   └── gifs/
└── README.md
```

## Resources

- [asciinema documentation](https://docs.asciinema.org/)
- [agg (asciinema gif generator)](https://github.com/asciinema/agg)
