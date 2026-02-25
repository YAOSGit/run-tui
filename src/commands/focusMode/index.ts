import type { Command } from '../../types/Command/index.js';
import { modKey, modKeyBindings } from '../../utils/platform/index.js';

export const focusModeCommand: Command = {
	id: 'FOCUS_MODE',
	displayText: 'Focus Mode',
	displayKey: modKey('f'),
	keys: modKeyBindings('f'),
	footer: 'hidden',
	helpSection: 'View & Modes',
	helpLabel: 'Focus mode',
	isEnabled: (p) => {
		return !p.ui.showScriptSelector && p.tasks.tasks.length > 0;
	},
	execute: (p) => {
		p.view.toggleFocusMode();
	},
	needsConfirmation: () => false,
};
