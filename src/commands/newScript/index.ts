import type { Command } from '../../types/Command/index.js';

export const newScriptCommand: Command = {
	id: 'NEW_SCRIPT',
	keys: [{ textKey: 'n', ctrl: false }],
	displayText: 'new',
	isEnabled: (p) => !p.ui.showScriptSelector,
	execute: (p) => {
		p.ui.openScriptSelector();
	},
};
