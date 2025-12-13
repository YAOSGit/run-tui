import type { Command } from '../../types/Command/index.js';

export const closeTabCommand: Command = {
	id: 'CLOSE_TAB',
	keys: [{ textKey: 'x', ctrl: false }],
	displayText: 'close',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		(ctx.taskStatus === 'success' || ctx.taskStatus === 'error'),
	execute: (ctx) => {
		if (ctx.activeTask) {
			ctx.removeTask(ctx.activeTask);
			ctx.setRunningTasks((prev) => prev.filter((t) => t !== ctx.activeTask));
			ctx.setActiveTabIndex((prev) => {
				if (prev >= ctx.runningTasks.length - 1) {
					return Math.max(0, ctx.runningTasks.length - 2);
				}
				return prev;
			});
		}
	},
};
