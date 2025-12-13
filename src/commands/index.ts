import type { Command } from '../types/Command/index.js';
import { closeTabCommand } from './closeTab.js';
import { filterCommand } from './filter.js';
import { killCommand } from './kill.js';
import { leftArrowCommand, rightArrowCommand } from './navigation.js';
import { newScriptCommand } from './newScript.js';
import { quitCommand } from './quit.js';
import { restartCommand } from './restart.js';

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

export { closeTabCommand } from './closeTab.js';
export { filterCommand } from './filter.js';
export { killCommand } from './kill.js';
export { leftArrowCommand, rightArrowCommand } from './navigation.js';
export { newScriptCommand } from './newScript.js';
export { quitCommand } from './quit.js';
export { restartCommand } from './restart.js';
