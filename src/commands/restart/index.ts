import type { Command } from '../../types/Command/index.js';

export const restartCommand: Command = {
	id: 'RESTART',
	keys: [{ textKey: 'r', ctrl: false }],
	displayText: 'restart',
	footer: 'optional',
	footerOrder: 30,
	helpSection: 'General',
	helpLabel: 'Restart task',
	isEnabled: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return (
			!p.ui.showScriptSelector &&
			p.tasks.tasks.length > 0 &&
			(taskStatus === 'success' ||
				taskStatus === 'error' ||
				taskStatus === 'restarting' ||
				taskStatus === 'running')
		);
	},
	needsConfirmation: (p) => {
		const taskStatus = p.view.activeTask
			? p.tasks.getTaskStatus(p.view.activeTask)
			: undefined;
		return taskStatus === 'running';
	},
	confirmMessage: (p) => `Restart ${p.view.activeTask}?`,
	execute: (p) => {
		if (p.view.activeTask) {
			const status = p.tasks.getTaskStatus(p.view.activeTask);
			if (status === 'running') p.tasks.killTask(p.view.activeTask);
			p.tasks.restartTask(p.view.activeTask);
		}
	},
};

export const restartAllCommand: Command = {
	id: 'RESTART_ALL',
	keys: [{ textKey: 'R', ctrl: false, shift: true }],
	displayKey: 'shift + r',
	displayText: 'restart all',
	footer: 'hidden',
	helpSection: 'Mass Actions (Shift)',
	helpLabel: 'Restart all tasks',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length === 0) return false;
		return p.tasks.tasks.some((task) => {
			const status = p.tasks.getTaskStatus(task);
			return (
				status === 'success' ||
				status === 'error' ||
				status === 'running' ||
				status === 'restarting'
			);
		});
	},
	needsConfirmation: (p) => {
		return p.tasks.tasks.some((task) => {
			const status = p.tasks.getTaskStatus(task);
			return status === 'running';
		});
	},
	confirmMessage: () => 'Restart all tasks?',
	execute: (p) => {
		for (const task of p.tasks.tasks) {
			const status = p.tasks.getTaskStatus(task);
			if (status === 'running') p.tasks.killTask(task);
			p.tasks.restartTask(task);
		}
	},
};
