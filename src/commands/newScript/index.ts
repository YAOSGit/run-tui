import type { Command } from '../../providers/CommandsProvider/CommandsProvider.types.js';

export const newScriptCommand: Command = {
	id: 'NEW_SCRIPT',
	keys: [{ textKey: 'n', ctrl: false }],
	displayText: 'new',
	footer: 'optional',
	footerOrder: 10,
	helpSection: 'General',
	helpLabel: 'New script',
	isEnabled: (p) => !p.ui.showScriptSelector,
	execute: (p) => { p.ui.openScriptSelector(); },
};
