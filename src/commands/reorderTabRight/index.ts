import type { Command } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { modKey } from '../../utils/platform/index.js';

export const reorderTabRightCommand: Command = {
	id: 'REORDER_TAB_RIGHT',
	displayText: 'Move tab right',
	displayKey: modKey('→'),
	// On macOS, opt+→ sends ESC-f (meta=true, textKey='f') in most terminals.
	// On other platforms, alt+→ also sends meta=true + arrow.
	keys: [
		{ textKey: 'f', meta: true },
		{ rightArrow: true, meta: true, shift: false, ctrl: false },
	],
	footer: 'hidden',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length <= 1) return false;
		if (!p.view.activeTask) return false;
		const index = p.tasks.tasks.indexOf(p.view.activeTask);
		return index >= 0 && index < p.tasks.tasks.length - 1;
	},
	execute: (p) => {
		if (p.view.activeTask) {
			p.tasks.moveTaskRight(p.view.activeTask);
		}
	},
	needsConfirmation: () => false,
};
