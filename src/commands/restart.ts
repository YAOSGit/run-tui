import type { Command } from '../types/Command/index.js';

export const restartCommand: Command = {
	id: 'RESTART',
	keys: [{ textKey: 'r', ctrl: false }],
	displayText: 'restart',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		(ctx.taskStatus === 'success' || ctx.taskStatus === 'error'),
	execute: (ctx) => {
		if (ctx.activeTask) {
			ctx.spawnTask(ctx.activeTask);
		}
	},
};
