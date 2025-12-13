import { closeTabCommand } from '../../commands/closeTab/index.js';
import { filterCommand } from '../../commands/filter/index.js';
import { killCommand } from '../../commands/kill/index.js';
import {
	leftArrowCommand,
	rightArrowCommand,
} from '../../commands/navigation/index.js';
import { newScriptCommand } from '../../commands/newScript/index.js';
import { quitCommand } from '../../commands/quit/index.js';
import { restartCommand } from '../../commands/restart/index.js';
import type { Command } from '../../types/Command/index.js';

// Commands in display order for footer
export const commands: Command[] = [
	leftArrowCommand,
	rightArrowCommand,
	newScriptCommand,
	closeTabCommand,
	restartCommand,
	filterCommand,
	killCommand,
	quitCommand,
];

export const CONFIRM_YES_KEYS = [
	{ textKey: 'y', ctrl: false },
	{ specialKey: 'enter', ctrl: false },
];

export const CONFIRM_NO_KEYS = [
	{ textKey: 'n', ctrl: false },
	{ specialKey: 'esc', ctrl: false },
];
