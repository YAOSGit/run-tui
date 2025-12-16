import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { closeTabCommand } from './index.js';

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

describe('closeTabCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(closeTabCommand.id).toBe('CLOSE_TAB');
		});

		it('has correct keys', () => {
			expect(closeTabCommand.keys).toEqual([{ textKey: 'x', ctrl: false }]);
		});

		it('has correct displayText', () => {
			expect(closeTabCommand.displayText).toBe('close');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(closeTabCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(closeTabCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task is running', () => {
			const ctx = createMockContext({ taskStatus: 'running' });
			expect(closeTabCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task is pending', () => {
			const ctx = createMockContext({ taskStatus: 'pending' });
			expect(closeTabCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when task status is success', () => {
			const ctx = createMockContext({ taskStatus: 'success' });
			expect(closeTabCommand.isEnabled(ctx)).toBe(true);
		});

		it('returns true when task status is error', () => {
			const ctx = createMockContext({ taskStatus: 'error' });
			expect(closeTabCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('does nothing when no active task', () => {
			const ctx = createMockContext({ activeTask: undefined });
			closeTabCommand.execute(ctx);

			expect(ctx.removeTask).not.toHaveBeenCalled();
			expect(ctx.setRunningTasks).not.toHaveBeenCalled();
			expect(ctx.setActiveTabIndex).not.toHaveBeenCalled();
		});

		it('removes the active task', () => {
			const ctx = createMockContext({ activeTask: 'build' });
			closeTabCommand.execute(ctx);

			expect(ctx.removeTask).toHaveBeenCalledWith('build');
		});

		it('updates running tasks to exclude active task', () => {
			const ctx = createMockContext({
				activeTask: 'build',
				runningTasks: ['build', 'test', 'lint'],
			});
			closeTabCommand.execute(ctx);

			expect(ctx.setRunningTasks).toHaveBeenCalled();
			const updateFn = (ctx.setRunningTasks as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			const result = updateFn(['build', 'test', 'lint']);
			expect(result).toEqual(['test', 'lint']);
		});

		it('adjusts active tab index when closing last tab', () => {
			const ctx = createMockContext({
				activeTask: 'lint',
				runningTasks: ['build', 'test', 'lint'],
			});
			closeTabCommand.execute(ctx);

			expect(ctx.setActiveTabIndex).toHaveBeenCalled();
			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			// When at last index (2), should go to previous (1)
			expect(updateFn(2)).toBe(1);
		});

		it('keeps active tab index when not closing last tab', () => {
			const ctx = createMockContext({
				activeTask: 'build',
				runningTasks: ['build', 'test', 'lint'],
			});
			closeTabCommand.execute(ctx);

			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			// When at index 0 and not last, stay at 0
			expect(updateFn(0)).toBe(0);
		});

		it('returns 0 when closing the only tab', () => {
			const ctx = createMockContext({
				activeTask: 'build',
				runningTasks: ['build'],
			});
			closeTabCommand.execute(ctx);

			const updateFn = (ctx.setActiveTabIndex as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(0)).toBe(0);
		});
	});
});
