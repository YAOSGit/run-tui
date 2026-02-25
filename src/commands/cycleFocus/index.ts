import type { Command } from '../../types/Command/index.js';

export const cycleFocusCommand: Command = {
	id: 'CYCLE_FOCUS',
	displayText: 'Cycle Focus',
	displayKey: 'tab',
	keys: [{ specialKey: 'tab' }],
	footer: 'hidden',
	helpSection: 'View & Modes',
	helpLabel: 'Cycle split focus',
	isEnabled: (p) => {
		// Only enable if split mode is active (splitTaskName is populated)
		return !p.ui.showScriptSelector && p.view.splitTaskName !== null;
	},
	execute: (p) => {
		p.view.cyclePaneFocus();
	},
	needsConfirmation: () => false,
};
