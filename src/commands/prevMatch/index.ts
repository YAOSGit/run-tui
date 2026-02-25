import type { Command } from '../../types/Command/index.js';

export const prevMatchCommand: Command = {
	id: 'PREV_MATCH',
	keys: [{ textKey: 'N', ctrl: false, shift: true }],
	displayText: 'prev',
	// Provide prev match command if we're not currently typing in search, but have a query
	isEnabled: (p) =>
		!p.ui.showScriptSelector &&
		!p.view.showSearch &&
		p.view.searchQuery.length > 0,
	execute: (p) => {
		p.view.prevMatch();
	},
};
