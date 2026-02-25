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
import { focusModeCommand } from '../../commands/focusMode/index.js';
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
import type { Command } from '../../types/Command/index.js';
import type { KeyBinding } from '../../types/KeyBinding/index.js';

export const CONFIRM_YES_KEYS: KeyBinding[] = [
	{ textKey: 'y', ctrl: false },
	{ specialKey: 'enter', ctrl: false },
];

export const CONFIRM_NO_KEYS: KeyBinding[] = [
	{ textKey: 'n', ctrl: false },
	{ specialKey: 'esc', ctrl: false },
];

export const COMMANDS: Command[] = [
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
	focusModeCommand,
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

	// 7. General/Quit
	helpCommand,
	quitCommand,

	// (Hidden navigation utilities)
	scrollUpCommand,
	scrollDownCommand,
	scrollToBottomCommand,
];
