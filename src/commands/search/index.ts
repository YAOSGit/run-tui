import type { Command } from '../../types/Command/index.js';

export const searchCommand: Command = {
	id: 'SEARCH',
	keys: [{ textKey: 'f', ctrl: true }],
	displayKey: 'ctrl + f',
	displayText: 'search',
	footer: 'optional',
	footerOrder: 60,
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Search logs',
	isEnabled: (p) => !p.ui.showScriptSelector && p.tasks.tasks.length > 0 && !p.view.showSearch,
	execute: (p) => { p.view.openSearch(); },
};
