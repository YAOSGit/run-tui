import type { Command } from '../../types/Command/index.js';

export const scrollUpCommand: Command = {
	id: 'SCROLL_UP',
	keys: [{ specialKey: 'up' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		ctx.totalLogs > ctx.viewHeight && // Only enable if there are more logs than view height
		ctx.scrollOffset < ctx.totalLogs - ctx.viewHeight, // Can scroll up if not at top
	execute: (ctx) => {
		ctx.scrollUp();
	},
};

export const scrollDownCommand: Command = {
	id: 'SCROLL_DOWN',
	keys: [{ specialKey: 'down' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		ctx.totalLogs > ctx.viewHeight && // Only enable if there are more logs than view height
		ctx.scrollOffset > 0, // Can scroll down if not at bottom
	execute: (ctx) => {
		ctx.scrollDown();
	},
};

export const scrollToBottomCommand: Command = {
	id: 'SCROLL_TO_BOTTOM',
	keys: [{ textKey: 'b' }],
	displayText: 'bottom',
	isEnabled: (ctx) =>
		!ctx.showScriptSelector &&
		ctx.runningTasks.length > 0 &&
		!ctx.autoScroll,
	execute: (ctx) => {
		ctx.scrollToBottom();
	},
};
