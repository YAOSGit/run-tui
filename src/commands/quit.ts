import type { Command } from '../types/Command/index.js';

export const quitCommand: Command = {
	id: 'QUIT',
	keys: [
		{ textKey: 'q', ctrl: false },
		{ specialKey: 'esc', ctrl: false },
	],
	displayText: 'quit',
	isEnabled: (ctx) => !ctx.showScriptSelector,
	execute: (ctx) => {
		ctx.handleQuit();
	},
	needsConfirmation: (ctx) => ctx.hasRunningTasks || ctx.keepAlive,
	confirmMessage: (ctx) => {
		const runningCount = ctx.runningTasks.filter(
			(task) => ctx.taskStatus === 'running',
		).length;
		if (runningCount > 0) {
			return `Quit with ${runningCount} running task${runningCount > 1 ? 's' : ''}?`;
		}
		return 'Quit?';
	},
};
