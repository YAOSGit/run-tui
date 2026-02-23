import type { Command } from '../../types/Command/index.js';

export const nextMatchCommand: Command = {
	id: 'NEXT_MATCH',
	keys: [{ textKey: 'n', ctrl: false }],
	displayText: 'next',
	// Provide next match command if we're not currently typing in search, but have a query
	isEnabled: (p) =>
		!p.ui.showScriptSelector &&
		!p.view.showSearch &&
		p.view.searchQuery.length > 0,
	execute: (p) => {
		p.onNextMatch?.();
	},
};
