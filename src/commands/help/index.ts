import type { Command } from '../../types/Command/index.js';

export const helpCommand: Command = {
	id: 'HELP',
	keys: [{ textKey: 'h', ctrl: false }],
	displayKey: 'h',
	displayText: 'help',
	isEnabled: () => true, // Help should be available practically anywhere natively
	execute: (deps) => {
		deps.ui.toggleHelp();
	},
};
