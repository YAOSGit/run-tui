import type { Command } from '../types/Command/index.js';

export const killCommand: Command = {
	id: 'KILL',
	keys: [{ textKey: 'k', ctrl: false }],
	displayText: 'kill',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		ctx.taskStatus === 'running',
	execute: (ctx) => {
		if (ctx.activeTask) {
			ctx.killProcess(ctx.activeTask);
		}
	},
	needsConfirmation: () => true,
	confirmMessage: (ctx) => `Kill ${ctx.activeTask}?`,
};
