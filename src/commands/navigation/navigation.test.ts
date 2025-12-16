import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { leftArrowCommand, rightArrowCommand } from './index.js';

const createMockContext = (
	overrides: Partial<CommandContext> = {},
): CommandContext => ({
	activeTask: 'build',
	taskStatus: 'running',
	runningTasks: ['build', 'test', 'lint'],
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

describe('leftArrowCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(leftArrowCommand.id).toBe('LEFT_ARROW');
		});

		it('has correct keys', () => {
			expect(leftArrowCommand.keys).toEqual([{ specialKey: 'left' }]);
		});

		it('has correct displayKey', () => {
			expect(leftArrowCommand.displayKey).toBe('← / →');
		});

		it('has correct displayText', () => {
			expect(leftArrowCommand.displayText).toBe('switch');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(leftArrowCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(leftArrowCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when tasks are running and script selector is hidden', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: ['build'],
			});
			expect(leftArrowCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('goes to previous tab', () => {
			const ctx = createMockContext({
				runningTasks: ['build', 'test', 'lint'],
			});
			leftArrowCommand.execute(ctx);

			expect(ctx.setActiveTabIndex).toHaveBeenCalled();
			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(1)).toBe(0);
		});

		it('wraps to last tab when at first tab', () => {
			const ctx = createMockContext({
				runningTasks: ['build', 'test', 'lint'],
			});
			leftArrowCommand.execute(ctx);

			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(0)).toBe(2);
		});

		it('marks stderr as seen for the new tab', () => {
			const runningTasks = ['build', 'test', 'lint'];
			const ctx = createMockContext({ runningTasks });
			leftArrowCommand.execute(ctx);

			// The markStderrSeen is called inside setActiveTabIndex callback
			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			// Simulate calling the update function (this will call markStderrSeen)
			updateFn(1);
			expect(ctx.markStderrSeen).toHaveBeenCalledWith('build');
		});
	});
});

describe('rightArrowCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(rightArrowCommand.id).toBe('RIGHT_ARROW');
		});

		it('has correct keys', () => {
			expect(rightArrowCommand.keys).toEqual([{ specialKey: 'right' }]);
		});

		it('has correct displayKey', () => {
			expect(rightArrowCommand.displayKey).toBe('← / →');
		});

		it('has correct displayText', () => {
			expect(rightArrowCommand.displayText).toBe('switch');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(rightArrowCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(rightArrowCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when tasks are running and script selector is hidden', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: ['build'],
			});
			expect(rightArrowCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('goes to next tab', () => {
			const ctx = createMockContext({
				runningTasks: ['build', 'test', 'lint'],
			});
			rightArrowCommand.execute(ctx);

			expect(ctx.setActiveTabIndex).toHaveBeenCalled();
			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(0)).toBe(1);
		});

		it('wraps to first tab when at last tab', () => {
			const ctx = createMockContext({
				runningTasks: ['build', 'test', 'lint'],
			});
			rightArrowCommand.execute(ctx);

			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(2)).toBe(0);
		});

		it('marks stderr as seen for the new tab', () => {
			const runningTasks = ['build', 'test', 'lint'];
			const ctx = createMockContext({ runningTasks });
			rightArrowCommand.execute(ctx);

			// The markStderrSeen is called inside setActiveTabIndex callback
			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			// Simulate calling the update function (this will call markStderrSeen)
			updateFn(0);
			expect(ctx.markStderrSeen).toHaveBeenCalledWith('test');
		});
	});
});
