import type { Command } from '../../types/Command/index.js';

export const killCommand: Command = {
	id: 'KILL',
	keys: [{ textKey: 'k', ctrl: false, shift: false }],
	displayKey: 'k',
	displayText: 'kill',
	footer: 'optional',
	footerOrder: 40,
	helpSection: 'General',
	helpLabel: 'Kill task',
	isEnabled: (p) => {
		const taskStatus = p.view.activeTask ? p.tasks.getTaskStatus(p.view.activeTask) : undefined;
		return (
			!p.ui.showScriptSelector &&
			p.tasks.tasks.length > 0 &&
			(taskStatus === 'running' || taskStatus === 'restarting')
		);
	},
	execute: (p) => {
		if (p.view.activeTask) {
			const status = p.tasks.getTaskStatus(p.view.activeTask);
			if (status === 'restarting') {
				p.tasks.cancelRestart(p.view.activeTask);
			} else {
				p.tasks.killTask(p.view.activeTask);
			}
		}
	},
	needsConfirmation: () => true,
	confirmMessage: (p) => `Kill ${p.view.activeTask}?`,
};

export const killAllCommand: Command = {
	id: 'KILL_ALL',
	keys: [{ textKey: 'K', ctrl: false, shift: true }],
	displayKey: 'shift + k',
	displayText: 'kill all',
	footer: 'hidden',
	helpSection: 'Mass Actions (Shift)',
	helpLabel: 'Kill all tasks',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length === 0) return false;
		return p.tasks.tasks.some((task) => {
			const status = p.tasks.getTaskStatus(task);
			return status === 'running' || status === 'restarting';
		});
	},
	execute: (p) => {
		for (const task of p.tasks.tasks) {
			const status = p.tasks.getTaskStatus(task);
			if (status === 'restarting') {
				p.tasks.cancelRestart(task);
			} else if (status === 'running') {
				p.tasks.killTask(task);
			}
		}
	},
	needsConfirmation: () => true,
	confirmMessage: () => 'Kill all running tasks?',
};