import type { Command } from '../../types/Command/index.js';

export const quitCommand: Command = {
	id: 'QUIT',
	keys: [
		{ textKey: 'q', ctrl: false },
		{ specialKey: 'esc', ctrl: false },
	],
	displayText: 'quit',
	footer: 'priority',
	footerOrder: 2,
	helpSection: 'General',
	helpLabel: 'Quit',
	isEnabled: (p) => !p.ui.showScriptSelector,
	execute: (p) => {
		p.tasks.killAllTasks();
		p.quit();
	},
	needsConfirmation: (p) => p.tasks.hasRunningTasks || p.keepAlive,
	confirmMessage: (p) => {
		const runningCount = Object.values(p.tasks.taskStates).filter(
			(t) => t.status === 'running',
		).length;
		if (runningCount > 0) {
			return `Quit with ${runningCount} running task${runningCount > 1 ? 's' : ''}?`;
		}
		return 'Quit?';
	},
};
