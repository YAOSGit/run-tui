import type { Command } from '../../types/Command/index.js';

export const killCommand: Command = {
	id: 'KILL',
	keys: [{ textKey: 'k', ctrl: false }],
	displayText: 'kill',
	isEnabled: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return (
			!p.ui.showScriptSelector &&
			p.tasks.tasks.length > 0 &&
			taskStatus === 'running'
		);
	},
	execute: (p) => {
		if (p.view.activeTask) {
			p.tasks.killTask(p.view.activeTask);
		}
	},
	needsConfirmation: () => true,
	confirmMessage: (p) => `Kill ${p.view.activeTask}?`,
};
