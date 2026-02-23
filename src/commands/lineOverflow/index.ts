import type { Command } from '../../types/Command/index.js';

export const lineOverflowCommand: Command = {
	id: 'LINE_OVERFLOW',
	keys: [{ textKey: 'w', ctrl: true }],
	displayKey: 'ctrl + w',
	displayText: 'wrap',
	footer: 'hidden',
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Toggle word wrap',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.ui.cycleLineOverflow();
	},
};
