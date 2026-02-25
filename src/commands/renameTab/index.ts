import type { Command } from '../../types/Command/index.js';

export const renameTabCommand: Command = {
	id: 'RENAME_TAB',
	keys: [{ textKey: 'e', ctrl: false }],
	displayText: 'rename tab',
	footer: 'optional',
	footerOrder: 50,
	helpSection: 'General',
	helpLabel: 'Rename tab',
	isEnabled: (providers) => providers.view.activeTask !== undefined,
	execute: (providers) => {
		providers.view.openRenameInput();
	},
};
