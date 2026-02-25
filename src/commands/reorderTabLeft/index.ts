import type { Command } from '../../types/Command/index.js';
import { modKey } from '../../utils/platform/index.js';

export const reorderTabLeftCommand: Command = {
	id: 'REORDER_TAB_LEFT',
	displayText: 'Move tab left',
	displayKey: modKey('←'),
	// On macOS, opt+← sends ESC-b (meta=true, textKey='b') in most terminals.
	// On other platforms, alt+← also sends meta=true + arrow.
	keys: [
		{ textKey: 'b', meta: true },
		{ leftArrow: true, meta: true, shift: false, ctrl: false },
	],
	footer: 'hidden',
	helpSection: 'View & Modes',
	helpLabel: 'Reorder tab',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length <= 1) return false;
		if (!p.view.activeTask) return false;
		const index = p.tasks.tasks.indexOf(p.view.activeTask);
		return index > 0;
	},
	execute: (p) => {
		if (p.view.activeTask) {
			p.tasks.moveTaskLeft(p.view.activeTask);
		}
	},
	needsConfirmation: () => false,
};
