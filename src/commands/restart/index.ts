import type { Command } from '../../types/Command/index.js';

export const restartCommand: Command = {
	id: 'RESTART',
	keys: [{ textKey: 'r', ctrl: false }],
	displayText: 'restart',
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
			p.tasks.restartTask(p.view.activeTask);
		}
	},
};
