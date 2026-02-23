import type { Command } from '../../types/Command/index.js';

export const toggleTimestampsCommand: Command = {
	id: 'TOGGLE_TIMESTAMPS',
	keys: [{ textKey: 't', ctrl: true }],
	displayKey: 'ctrl + t',
	displayText: 'time',
	footer: 'hidden',
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Toggle timestamps',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.view.toggleTimestamps();
	},
};
