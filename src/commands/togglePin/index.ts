import type { Command } from '../../types/Command/index.js';
import { modKey, modKeyBindings } from '../../utils/platform/index.js';

export const togglePinCommand: Command = {
	id: 'TOGGLE_PIN',
	displayText: 'Pin Tab',
	displayKey: modKey('p'),
	keys: modKeyBindings('p'),
	footer: 'hidden',
	helpSection: 'View & Modes',
	helpLabel: 'Pin tab',
	isEnabled: (p) => {
		return !p.ui.showScriptSelector && p.tasks.tasks.length > 0;
	},
	execute: (p) => {
		if (p.view.activeTask) {
			p.tasks.toggleTaskPin(p.view.activeTask);
		}
	},
	needsConfirmation: () => false,
};
