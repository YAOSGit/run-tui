import type { Command } from '../../types/Command/index.js';

export const leftArrowCommand: Command = {
	id: 'LEFT_ARROW',
	keys: [{ specialKey: 'left', meta: false, ctrl: false, shift: false }],
	displayKey: '← / →',
	displayText: 'switch',
	footer: 'priority',
	footerOrder: 1,
	helpSection: 'General',
	helpLabel: 'Switch tab',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => { p.view.navigateLeft(); },
};

export const rightArrowCommand: Command = {
	id: 'RIGHT_ARROW',
	keys: [{ specialKey: 'right', meta: false, ctrl: false, shift: false }],
	displayKey: '← / →',
	displayText: 'switch',
	footer: 'hidden', // deduplicated with leftArrowCommand
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => { p.view.navigateRight(); },
};
