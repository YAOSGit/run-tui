import { Box, Text, useInput } from 'ink';

import {
    COMMANDS,
} from '../../providers/CommandsProvider/CommandsProvider.consts.js';
import { getDisplayKey } from '../../providers/CommandsProvider/CommandsProvider.utils.js';
import { useUIState } from '../../providers/UIStateProvider/index.js';

// Build a lookup: commandId → displayKey — always reflects the real COMMANDS bindings.
const CMD_KEY_MAP = new Map<string, string>(
    COMMANDS.map((cmd) => [
        cmd.id,
        cmd.displayKey ?? getDisplayKey(cmd.keys),
    ]),
);

// Derive the ordered sections from the COMMANDS array itself.
// Same COMMANDS ordering is preserved within each section.
const HELP_SECTIONS = (() => {
    const sectionMap = new Map<string, { color: string; rows: Array<{ id: string; label: string }> }>();
    const SECTION_COLORS: Record<string, string> = {
        'General': 'yellow',
        'View & Modes': 'blue',
        'Logs (Ctrl)': 'green',
        'Mass Actions (Shift)': 'red',
    };
    for (const cmd of COMMANDS) {
        if (!cmd.helpSection) continue;
        if (!sectionMap.has(cmd.helpSection)) {
            sectionMap.set(cmd.helpSection, {
                color: SECTION_COLORS[cmd.helpSection] ?? 'white',
                rows: [],
            });
        }
        sectionMap.get(cmd.helpSection)?.rows.push({
            id: cmd.id,
            label: cmd.helpLabel ?? cmd.displayText,
        });
    }
    return Array.from(sectionMap.entries()).map(([title, { color, rows }]) => ({
        title,
        color,
        rows,
    }));
})();

export function HelpMenu({ width }: { width?: number }) {
    const { closeHelp } = useUIState();

    useInput((input, key) => {
        if (key.escape || input === 'q' || input === 'h') {
            closeHelp();
        }
    });

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="magenta"
            paddingX={2}
            paddingY={1}
            width={width}
        >
            <Box marginBottom={1} justifyContent="center">
                <Text bold color="magenta">
                    YAOSGit run - Keyboard Shortcuts
                </Text>
            </Box>

            <Box flexDirection="row" gap={4} justifyContent="center">
                {HELP_SECTIONS.map((section, sectionIdx) => (
                    <Box key={section.title} flexDirection="column" gap={1}>
                        <Text bold underline color={section.color as Parameters<typeof Text>[0]['color']}>
                            {section.title}
                        </Text>
                        {section.rows.map(({ id, label }) => {
                            const key = CMD_KEY_MAP.get(id) ?? id;
                            return (
                                <Text key={id}>
                                    <Text bold>{key}</Text> : {label}
                                </Text>
                            );
                        })}
                        {sectionIdx === HELP_SECTIONS.length - 1 && (
                            <Box marginTop={1}>
                                <Text dimColor>Press </Text>
                                <Text bold>ESC</Text>
                                <Text dimColor> or </Text>
                                <Text bold>q</Text>
                                <Text dimColor> to close</Text>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
