import type { Command } from '../../types/Command/index.js';

export const filterCommand: Command = {
	id: 'FILTER',
	keys: [{ textKey: 'o', ctrl: true }],
	displayKey: 'ctrl + o',
	displayText: 'Toggle output',
	footer: 'optional',
	footerOrder: 70,
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Toggle output filter',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.view.cycleLogFilter();
	},
};
