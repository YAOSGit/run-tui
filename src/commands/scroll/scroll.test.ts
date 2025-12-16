import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import {
	scrollDownCommand,
	scrollToBottomCommand,
	scrollUpCommand,
} from './index.js';

const createMockContext = (
	overrides: Partial<CommandContext> = {},
): CommandContext => ({
	activeTask: 'build',
	taskStatus: 'running',
	runningTasks: ['build', 'test'],
	hasRunningTasks: true,
	keepAlive: false,
	showScriptSelector: false,
	logFilter: null,
	scrollOffset: 0,
	totalLogs: 100,
	autoScroll: true,
	viewHeight: 20,
	killProcess: vi.fn(),
	spawnTask: vi.fn(),
	handleQuit: vi.fn(),
	setShowScriptSelector: vi.fn(),
	setLogFilter: vi.fn(),
	removeTask: vi.fn(),
	setRunningTasks: vi.fn(),
	setActiveTabIndex: vi.fn(),
	markStderrSeen: vi.fn(),
	scrollUp: vi.fn(),
	scrollDown: vi.fn(),
	scrollToBottom: vi.fn(),
	...overrides,
});

describe('scrollUpCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(scrollUpCommand.id).toBe('SCROLL_UP');
		});

		it('has correct keys', () => {
			expect(scrollUpCommand.keys).toEqual([{ specialKey: 'up' }]);
		});

		it('has correct displayKey', () => {
			expect(scrollUpCommand.displayKey).toBe('↑ / ↓');
		});

		it('has correct displayText', () => {
			expect(scrollUpCommand.displayText).toBe('scroll');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(scrollUpCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(scrollUpCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when totalLogs is less than viewHeight', () => {
			const ctx = createMockContext({ totalLogs: 10, viewHeight: 20 });
			expect(scrollUpCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when already at top (scrollOffset at max)', () => {
			const ctx = createMockContext({
				totalLogs: 100,
				viewHeight: 20,
				scrollOffset: 80, // At top (100 - 20 = 80)
			});
			expect(scrollUpCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when can scroll up', () => {
			const ctx = createMockContext({
				totalLogs: 100,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollUpCommand.isEnabled(ctx)).toBe(true);
		});

		it('returns true when partially scrolled', () => {
			const ctx = createMockContext({
				totalLogs: 100,
				viewHeight: 20,
				scrollOffset: 50,
			});
			expect(scrollUpCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('calls scrollUp', () => {
			const ctx = createMockContext();
			scrollUpCommand.execute(ctx);
			expect(ctx.scrollUp).toHaveBeenCalled();
		});
	});
});

describe('scrollDownCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(scrollDownCommand.id).toBe('SCROLL_DOWN');
		});

		it('has correct keys', () => {
			expect(scrollDownCommand.keys).toEqual([{ specialKey: 'down' }]);
		});

		it('has correct displayKey', () => {
			expect(scrollDownCommand.displayKey).toBe('↑ / ↓');
		});

		it('has correct displayText', () => {
			expect(scrollDownCommand.displayText).toBe('scroll');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(scrollDownCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(scrollDownCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when totalLogs is less than viewHeight', () => {
			const ctx = createMockContext({ totalLogs: 10, viewHeight: 20 });
			expect(scrollDownCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when already at bottom (scrollOffset is 0)', () => {
			const ctx = createMockContext({
				totalLogs: 100,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollDownCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when scrolled up', () => {
			const ctx = createMockContext({
				totalLogs: 100,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('calls scrollDown', () => {
			const ctx = createMockContext({ scrollOffset: 10 });
			scrollDownCommand.execute(ctx);
			expect(ctx.scrollDown).toHaveBeenCalled();
		});
	});
});

describe('scrollToBottomCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(scrollToBottomCommand.id).toBe('SCROLL_TO_BOTTOM');
		});

		it('has correct keys', () => {
			expect(scrollToBottomCommand.keys).toEqual([{ textKey: 'b' }]);
		});

		it('has correct displayText', () => {
			expect(scrollToBottomCommand.displayText).toBe('bottom');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(scrollToBottomCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(scrollToBottomCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when autoScroll is enabled', () => {
			const ctx = createMockContext({ autoScroll: true });
			expect(scrollToBottomCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when autoScroll is disabled', () => {
			const ctx = createMockContext({ autoScroll: false });
			expect(scrollToBottomCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('calls scrollToBottom', () => {
			const ctx = createMockContext({ autoScroll: false });
			scrollToBottomCommand.execute(ctx);
			expect(ctx.scrollToBottom).toHaveBeenCalled();
		});
	});
});
