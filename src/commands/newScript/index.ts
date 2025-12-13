import type { Command } from '../../types/Command/index.js';

export const newScriptCommand: Command = {
	id: 'NEW_SCRIPT',
	keys: [{ textKey: 'n', ctrl: false }],
	displayText: 'new',
	isEnabled: (ctx) => !ctx.showScriptSelector,
	execute: (ctx) => {
		ctx.setShowScriptSelector(true);
	},
};
