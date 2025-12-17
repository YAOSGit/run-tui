import type { Command } from '../../types/Command/index.js';

export const filterCommand: Command = {
	id: 'FILTER',
	keys: [{ textKey: 'f', ctrl: false }],
	displayText: 'filter',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0,
	execute: (p) => {
		p.view.cycleLogFilter();
	},
};
