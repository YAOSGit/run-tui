import type { Command } from '../../types/Command/index.js';

export const closeTabCommand: Command = {
	id: 'CLOSE_TAB',
	keys: [{ textKey: 'x', ctrl: false }],
	displayText: 'close',
	footer: 'optional',
	footerOrder: 20,
	helpSection: 'General',
	helpLabel: 'Close tab',
	isEnabled: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return (
			!p.ui.showScriptSelector &&
			p.tasks.tasks.length > 0 &&
			(taskStatus === 'success' ||
				taskStatus === 'error' ||
				taskStatus === 'running')
		);
	},
	needsConfirmation: () => true,
	confirmMessage: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return taskStatus === 'running'
			? `Kill & close ${p.view.activeTask}?`
			: `Close ${p.view.activeTask}?`;
	},
	execute: (p) => {
		if (p.view.activeTask) {
			const status = p.tasks.getTaskStatus(p.view.activeTask);
			if (status === 'running') p.tasks.killTask(p.view.activeTask);
			p.tasks.closeTask(p.view.activeTask);
		}
	},
};
