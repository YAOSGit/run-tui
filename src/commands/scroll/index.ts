import type { Command } from '../../types/Command/index.js';

export const scrollUpCommand: Command = {
	id: 'SCROLL_UP',
	keys: [{ specialKey: 'up' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length === 0) return false;
		if (p.view.totalLogs <= p.view.viewHeight) return false;
		const offset =
			p.view.activePane === 'split'
				? p.view.splitScrollOffset
				: p.view.primaryScrollOffset;
		return offset < p.view.totalLogs - p.view.viewHeight;
	},
	execute: (p) => {
		p.view.scrollUp();
	},
};

export const scrollDownCommand: Command = {
	id: 'SCROLL_DOWN',
	keys: [{ specialKey: 'down' }],
	displayKey: '↑ / ↓',
	displayText: 'scroll',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length === 0) return false;
		if (p.view.totalLogs <= p.view.viewHeight) return false;
		const offset =
			p.view.activePane === 'split'
				? p.view.splitScrollOffset
				: p.view.primaryScrollOffset;
		return offset > 0;
	},
	execute: (p) => {
		p.view.scrollDown();
	},
};

export const scrollToBottomCommand: Command = {
	id: 'SCROLL_TO_BOTTOM',
	keys: [{ textKey: 'b' }],
	displayKey: 'b',
	displayText: 'bottom',
	isEnabled: (p) => {
		if (p.ui.showScriptSelector || p.tasks.tasks.length === 0) return false;
		const autoScroll =
			p.view.activePane === 'split'
				? p.view.splitAutoScroll
				: p.view.primaryAutoScroll;
		return !autoScroll;
	},
	execute: (p) => {
		p.view.scrollToBottom();
	},
};
