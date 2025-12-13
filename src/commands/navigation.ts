import type { Command } from '../types/Command/index.js';

export const leftArrowCommand: Command = {
	id: 'LEFT_ARROW',
	keys: [{ specialKey: 'left' }],
	displayKey: '← / →', // Custom: show both arrows for navigation
	displayText: 'switch',
	isEnabled: (ctx) => !ctx.showScriptSelector && ctx.runningTasks.length > 0,
	execute: (ctx) => {
		ctx.setActiveTabIndex((prev) => {
			const newIndex = prev === 0 ? ctx.runningTasks.length - 1 : prev - 1;
			ctx.markStderrSeen(ctx.runningTasks[newIndex]);
			return newIndex;
		});
	},
};

export const rightArrowCommand: Command = {
	id: 'RIGHT_ARROW',
	keys: [{ specialKey: 'right' }],
	displayKey: '← / →', // Custom: show both arrows for navigation
	displayText: 'switch',
	isEnabled: (ctx) => !ctx.showScriptSelector && ctx.runningTasks.length > 0,
	execute: (ctx) => {
		ctx.setActiveTabIndex((prev) => {
			const newIndex = prev === ctx.runningTasks.length - 1 ? 0 : prev + 1;
			ctx.markStderrSeen(ctx.runningTasks[newIndex]);
			return newIndex;
		});
	},
};
