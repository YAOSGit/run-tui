import type { Command } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { modKey, modKeyBindings } from '../../utils/platform/index.js';

export const displayModeCommand: Command = {
	id: 'DISPLAY_MODE',
	displayText: 'Compact Mode',
	displayKey: modKey('m'),
	keys: modKeyBindings('m'),
	footer: 'hidden',
	helpSection: 'View & Modes',
	helpLabel: 'Compact mode',
	isEnabled: (p) => {
		return !p.ui.showScriptSelector && p.tasks.tasks.length > 0;
	},
	execute: (p) => {
		// When switching TO compact mode, clear any pinned tasks so the split
		// pane doesn't unexpectedly reappear when returning to full mode.
		if (p.view.displayMode === 'full') {
			for (const task of p.tasks.pinnedTasks) {
				p.tasks.toggleTaskPin(task);
			}
		}
		p.view.toggleDisplayMode();
	},
	needsConfirmation: () => false,
};
