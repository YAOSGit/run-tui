#!/bin/bash

# Automated demo recording script for run-tui
# This script uses asciinema to record a scripted demo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
RECORDING_DIR="$SCRIPT_DIR/asciinema/recordings"
GIF_DIR="$SCRIPT_DIR/asciinema/gifs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Recording settings
IDLE_LIMIT=2

echo -e "${GREEN}=== run-tui Demo Recording Script ===${NC}"
echo ""

# Check dependencies
check_deps() {
    local missing=0

    if ! command -v asciinema &> /dev/null; then
        echo -e "${RED}Error: asciinema is not installed${NC}"
        echo "  Install with: brew install asciinema"
        missing=1
    fi

    if ! command -v agg &> /dev/null; then
        echo -e "${YELLOW}Warning: agg is not installed (needed for GIF conversion)${NC}"
        echo "  Install with: brew install agg"
    fi

    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Build run-tui if needed
build_if_needed() {
    if [ ! -f "$ROOT_DIR/dist/cli.js" ]; then
        echo -e "${YELLOW}Building run-tui...${NC}"
        cd "$ROOT_DIR"
        npm run build
        cd "$SCRIPT_DIR"
    fi
}

# Show terminal size
show_terminal_size() {
    local actual_cols=$(tput cols)
    local actual_rows=$(tput lines)
    echo -e "${YELLOW}Terminal size: ${actual_cols}x${actual_rows}${NC}"
}

# Record demo with direct command execution
record_demo() {
    local name="${1:-demo}"
    local scripts="${2:-dev build test}"
    local cast_file="$RECORDING_DIR/${name}.cast"

    mkdir -p "$RECORDING_DIR"

    echo ""
    echo -e "${GREEN}Starting recording: ${name}${NC}"
    echo -e "Recording to: ${cast_file}"
    echo -e "Scripts: ${scripts}"
    echo ""

    cd "$SCRIPT_DIR/basic-project"

    # Use -c to directly run run-tui command (uses current terminal size)
    asciinema rec "$cast_file" \
        --idle-time-limit "$IDLE_LIMIT" \
        --overwrite \
        -c "$ROOT_DIR/dist/cli.js $scripts -H 18"

    cd "$SCRIPT_DIR"

    echo ""
    echo -e "${GREEN}Recording saved to: ${cast_file}${NC}"
}

# Record demo interactively (manual mode)
record_interactive() {
    local name="${1:-demo}"
    local cast_file="$RECORDING_DIR/${name}.cast"

    mkdir -p "$RECORDING_DIR"

    echo ""
    echo -e "${GREEN}Starting interactive recording: ${name}${NC}"
    echo -e "Recording to: ${cast_file}"
    echo ""
    echo -e "${YELLOW}Instructions:${NC}"
    echo "  1. Run: ../../dist/cli.js dev build test"
    echo "  2. Use arrow keys to switch tabs"
    echo "  3. Press 'f' to cycle log filters"
    echo "  4. Press 'q' then 'y' to quit"
    echo "  5. Type 'exit' or Ctrl+D to stop recording"
    echo ""
    echo -e "${GREEN}Press Enter to start recording...${NC}"
    read -r

    cd "$SCRIPT_DIR/basic-project"

    # Uses current terminal size
    asciinema rec "$cast_file" \
        --idle-time-limit "$IDLE_LIMIT" \
        --overwrite

    cd "$SCRIPT_DIR"

    echo ""
    echo -e "${GREEN}Recording saved to: ${cast_file}${NC}"
}

# Convert to GIF
convert_to_gif() {
    local name="${1:-demo}"
    local cast_file="$RECORDING_DIR/${name}.cast"
    local gif_file="$GIF_DIR/${name}.gif"

    if [ ! -f "$cast_file" ]; then
        echo -e "${RED}Error: Recording not found: ${cast_file}${NC}"
        return 1
    fi

    if ! command -v agg &> /dev/null; then
        echo -e "${RED}Error: agg is not installed${NC}"
        echo "  Install with: brew install agg"
        return 1
    fi

    mkdir -p "$GIF_DIR"

    echo ""
    echo -e "${GREEN}Converting to GIF...${NC}"

    agg "$cast_file" "$gif_file" \
        --font-family "JetBrains Mono,Monaco,Menlo,monospace" \
        --font-size 14 \
        --theme "1e1e1e,d4d4d4,000000,cd3131,0dbc79,e5e510,2472c8,bc3fbc,11a8cd,e5e5e5" \
        --idle-time-limit "$IDLE_LIMIT" \
        --fps-cap 10

    echo -e "${GREEN}GIF saved to: ${gif_file}${NC}"

    # Show file size
    local size=$(du -h "$gif_file" | cut -f1)
    echo -e "File size: ${size}"
    echo ""
    echo -e "${YELLOW}Tip: Compress large GIFs at https://ezgif.com/optimize${NC}"
}

# Playback recording
playback() {
    local name="${1:-demo}"
    local cast_file="$RECORDING_DIR/${name}.cast"

    if [ ! -f "$cast_file" ]; then
        echo -e "${RED}Error: Recording not found: ${cast_file}${NC}"
        return 1
    fi

    echo -e "${GREEN}Playing back: ${name}${NC}"
    asciinema play "$cast_file"
}

# Show usage
usage() {
    echo "Usage: $0 [command] [name] [scripts]"
    echo ""
    echo "Commands:"
    echo "  record [name] [scripts]  Record run-tui directly (auto mode)"
    echo "  interactive [name]       Record interactively (manual mode)"
    echo "  convert [name]           Convert recording to GIF"
    echo "  play [name]              Playback a recording"
    echo "  all [name] [scripts]     Record and convert to GIF"
    echo ""
    echo "Arguments:"
    echo "  name     Recording name (default: demo)"
    echo "  scripts  Scripts to run (default: 'dev build test')"
    echo ""
    echo "Examples:"
    echo "  $0 record                        # Record 'demo' with dev build test"
    echo "  $0 record basic 'dev test'       # Record 'basic' with dev test"
    echo "  $0 interactive myrecording       # Interactive recording"
    echo "  $0 convert demo                  # Convert demo.cast to demo.gif"
    echo "  $0 all filtering 'dev build'     # Record and convert"
    echo ""
    echo "The recording uses your current terminal size."
    echo "Resize your terminal before recording for best results."
}

# Main
main() {
    check_deps
    build_if_needed

    local cmd="${1:-all}"
    local name="${2:-demo}"
    local scripts="${3:-dev build test}"

    case "$cmd" in
        record)
            show_terminal_size
            record_demo "$name" "$scripts"
            ;;
        interactive)
            show_terminal_size
            record_interactive "$name"
            ;;
        convert)
            convert_to_gif "$name"
            ;;
        play)
            playback "$name"
            ;;
        all)
            show_terminal_size
            record_demo "$name" "$scripts"
            convert_to_gif "$name"
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            echo -e "${RED}Unknown command: ${cmd}${NC}"
            usage
            exit 1
            ;;
    esac
}

main "$@"
