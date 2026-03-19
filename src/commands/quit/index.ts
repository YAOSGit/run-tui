import type { Command } from '../../types/Command/index.js';

export const quitCommand: Command = {
	id: 'QUIT',
	keys: [
		{ textKey: 'q', ctrl: false },
		{ specialKey: 'esc', ctrl: false },
	],
	displayKey: 'q / ESC',
	displayText: 'quit',
	footer: 'priority',
	footerOrder: 2,
	helpSection: 'General',
	helpLabel: 'Quit',
	isEnabled: (deps) => !deps.ui.showScriptSelector,
	execute: (deps) => {
		deps.tasks.killAllTasks();
		deps.onQuit();
	},
	needsConfirmation: (deps) => deps.tasks.hasRunningTasks || deps.keepAlive,
	confirmMessage: (deps) => {
		const runningCount = Object.values(deps.tasks.taskStates).filter(
			(t) => t.status === 'running',
		).length;
		if (runningCount > 0) {
			return `Quit with ${runningCount} running task${runningCount > 1 ? 's' : ''}?`;
		}
		return 'Quit?';
	},
};
