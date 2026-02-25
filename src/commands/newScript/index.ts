import type { Command } from '../../types/Command/index.js';

export const newScriptCommand: Command = {
	id: 'NEW_SCRIPT',
	keys: [{ textKey: 'n', ctrl: false }],
	displayText: 'new',
	footer: 'optional',
	footerOrder: 10,
	helpSection: 'General',
	helpLabel: 'New script',
	isEnabled: (p) => !p.ui.showScriptSelector,
	execute: (p) => {
		p.ui.openScriptSelector();
	},
};
