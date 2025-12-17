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
import {
	scrollDownCommand,
	scrollToBottomCommand,
	scrollUpCommand,
} from '../../commands/scroll/index.js';
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
	leftArrowCommand,
	rightArrowCommand,
	scrollUpCommand,
	scrollDownCommand,
	scrollToBottomCommand,
	newScriptCommand,
	closeTabCommand,
	restartCommand,
	filterCommand,
	killCommand,
	quitCommand,
];
