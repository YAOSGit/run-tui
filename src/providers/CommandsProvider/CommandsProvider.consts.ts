import {
	clearAllLogsCommand,
	clearCurrentLogsCommand,
} from '../../commands/clearLogs/index.js';
import { closeTabCommand } from '../../commands/closeTab/index.js';
import { cycleFocusCommand } from '../../commands/cycleFocus/index.js';
import { displayModeCommand } from '../../commands/displayMode/index.js';
import {
	copyCurrentLogsCommand,
	exportAllLogsCommand,
	exportCurrentLogsCommand,
} from '../../commands/exportLogs/index.js';
import { filterCommand } from '../../commands/filter/index.js';
import { helpCommand } from '../../commands/help/index.js';
import { killAllCommand, killCommand } from '../../commands/kill/index.js';
import { lineOverflowCommand } from '../../commands/lineOverflow/index.js';
import {
	leftArrowCommand,
	rightArrowCommand,
} from '../../commands/navigation/index.js';
import { newScriptCommand } from '../../commands/newScript/index.js';
import { nextMatchCommand } from '../../commands/nextMatch/index.js';
import { prevMatchCommand } from '../../commands/prevMatch/index.js';
import { quitCommand } from '../../commands/quit/index.js';
import { renameTabCommand } from '../../commands/renameTab/index.js';
import { reorderTabLeftCommand } from '../../commands/reorderTabLeft/index.js';
import { reorderTabRightCommand } from '../../commands/reorderTabRight/index.js';
import {
	restartAllCommand,
	restartCommand,
} from '../../commands/restart/index.js';
import {
	scrollDownCommand,
	scrollToBottomCommand,
	scrollUpCommand,
} from '../../commands/scroll/index.js';
import { searchCommand } from '../../commands/search/index.js';
import { togglePinCommand } from '../../commands/togglePin/index.js';
import { toggleTimestampsCommand } from '../../commands/toggleTimestamps/index.js';
import type { RunTuiCommand } from './CommandsProvider.types.js';
import type { KeyBinding } from '../../types/KeyBinding/index.js';

export const CONFIRM_YES_KEYS: KeyBinding[] = [
	{ textKey: 'y', ctrl: false },
	{ specialKey: 'enter', ctrl: false },
];

export const CONFIRM_NO_KEYS: KeyBinding[] = [
	{ textKey: 'n', ctrl: false },
	{ specialKey: 'esc', ctrl: false },
];

/**
 * Project-specific commands passed to createCommandsProvider().
 * The toolkit appends shared help, quit, scroll, and cycleFocus commands
 * automatically; project commands listed first take priority over toolkit
 * defaults when key bindings overlap.
 */
export const PROJECT_COMMANDS: RunTuiCommand[] = [
	// 1. Navigation (always visible/core)
	leftArrowCommand,
	rightArrowCommand,

	// 2. Search (core action)
	searchCommand,
	nextMatchCommand,
	prevMatchCommand,

	// 3. Management (creating/closing/modifying)
	newScriptCommand,
	renameTabCommand,
	closeTabCommand,
	togglePinCommand,
	reorderTabLeftCommand,
	reorderTabRightCommand,

	// 4. Logs/View actions
	filterCommand,
	lineOverflowCommand,
	toggleTimestampsCommand,
	displayModeCommand,
	cycleFocusCommand,

	// 5. Data/Export
	exportCurrentLogsCommand,
	exportAllLogsCommand,
	copyCurrentLogsCommand,
	clearCurrentLogsCommand,
	clearAllLogsCommand,

	// 6. Execution control
	restartCommand,
	restartAllCommand,
	killCommand,
	killAllCommand,

	// 7. General (project-specific overrides that shadow toolkit defaults)
	helpCommand,
	quitCommand,

	// (Hidden navigation utilities)
	scrollUpCommand,
	scrollDownCommand,
	scrollToBottomCommand,
];

/**
 * Section colors for the help menu.
 */
export const SECTION_COLORS: Record<string, string> = {
	General: 'yellow',
	'View & Modes': 'blue',
	'Logs (Ctrl)': 'green',
	'Mass Actions (Shift)': 'red',
};
