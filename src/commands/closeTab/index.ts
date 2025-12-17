import type { Command } from '../../types/Command/index.js';

export const closeTabCommand: Command = {
	id: 'CLOSE_TAB',
	keys: [{ textKey: 'x', ctrl: false }],
	displayText: 'close',
	isEnabled: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return (
			!p.ui.showScriptSelector &&
			p.tasks.tasks.length > 0 &&
			(taskStatus === 'success' || taskStatus === 'error')
		);
	},
	execute: (p) => {
		if (p.view.activeTask) {
			p.tasks.closeTask(p.view.activeTask);
		}
	},
};
