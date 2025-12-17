import type { Command } from '../../types/Command/index.js';

export const leftArrowCommand: Command = {
	id: 'LEFT_ARROW',
	keys: [{ specialKey: 'left' }],
	displayKey: '← / →',
	displayText: 'switch',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.view.navigateLeft();
	},
};

export const rightArrowCommand: Command = {
	id: 'RIGHT_ARROW',
	keys: [{ specialKey: 'right' }],
	displayKey: '← / →',
	displayText: 'switch',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.view.navigateRight();
	},
};
