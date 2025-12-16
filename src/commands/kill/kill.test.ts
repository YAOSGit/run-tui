import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { killCommand } from './index.js';

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

describe('killCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(killCommand.id).toBe('KILL');
		});

		it('has correct keys', () => {
			expect(killCommand.keys).toEqual([{ textKey: 'k', ctrl: false }]);
		});

		it('has correct displayText', () => {
			expect(killCommand.displayText).toBe('kill');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(killCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(killCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task status is success', () => {
			const ctx = createMockContext({ taskStatus: 'success' });
			expect(killCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task status is error', () => {
			const ctx = createMockContext({ taskStatus: 'error' });
			expect(killCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task status is pending', () => {
			const ctx = createMockContext({ taskStatus: 'pending' });
			expect(killCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when task is running', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: ['build'],
				taskStatus: 'running',
			});
			expect(killCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('kills the active task', () => {
			const ctx = createMockContext({ activeTask: 'build' });
			killCommand.execute(ctx);

			expect(ctx.killProcess).toHaveBeenCalledWith('build');
		});

		it('does nothing when no active task', () => {
			const ctx = createMockContext({ activeTask: undefined });
			killCommand.execute(ctx);

			expect(ctx.killProcess).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('always returns true', () => {
			const ctx = createMockContext();
			expect(killCommand.needsConfirmation?.(ctx)).toBe(true);
		});
	});

	describe('confirmMessage', () => {
		it('includes the active task name', () => {
			const ctx = createMockContext({ activeTask: 'build' });
			const message =
				typeof killCommand.confirmMessage === 'function'
					? killCommand.confirmMessage(ctx)
					: killCommand.confirmMessage;
			expect(message).toBe('Kill build?');
		});

		it('includes different task name', () => {
			const ctx = createMockContext({ activeTask: 'dev' });
			const message =
				typeof killCommand.confirmMessage === 'function'
					? killCommand.confirmMessage(ctx)
					: killCommand.confirmMessage;
			expect(message).toBe('Kill dev?');
		});
	});
});
