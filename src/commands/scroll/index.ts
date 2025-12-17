import type { Command } from '../../types/Command/index.js';

export const scrollUpCommand: Command = {
	id: 'SCROLL_UP',
	keys: [{ specialKey: 'up' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (p) =>
		!p.ui.showScriptSelector &&
		p.tasks.tasks.length > 0 &&
		p.view.totalLogs > p.view.viewHeight &&
		p.view.scrollOffset < p.view.totalLogs - p.view.viewHeight,
	execute: (p) => {
		p.view.scrollUp();
	},
};

export const scrollDownCommand: Command = {
	id: 'SCROLL_DOWN',
	keys: [{ specialKey: 'down' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (p) =>
		!p.ui.showScriptSelector &&
		p.tasks.tasks.length > 0 &&
		p.view.totalLogs > p.view.viewHeight &&
		p.view.scrollOffset > 0,
	execute: (p) => {
		p.view.scrollDown();
	},
};

export const scrollToBottomCommand: Command = {
	id: 'SCROLL_TO_BOTTOM',
	keys: [{ textKey: 'b' }],
	displayText: 'bottom',
	isEnabled: (p) =>
		!p.ui.showScriptSelector &&
		p.tasks.tasks.length > 0 &&
		!p.view.autoScroll,
	execute: (p) => {
		p.view.scrollToBottom();
	},
};
