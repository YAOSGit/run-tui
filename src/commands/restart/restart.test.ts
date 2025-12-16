import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { restartCommand } from './index.js';

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

describe('restartCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(restartCommand.id).toBe('RESTART');
		});

		it('has correct keys', () => {
			expect(restartCommand.keys).toEqual([{ textKey: 'r', ctrl: false }]);
		});

		it('has correct displayText', () => {
			expect(restartCommand.displayText).toBe('restart');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(restartCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(restartCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task is running', () => {
			const ctx = createMockContext({ taskStatus: 'running' });
			expect(restartCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when task is pending', () => {
			const ctx = createMockContext({ taskStatus: 'pending' });
			expect(restartCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when task status is success', () => {
			const ctx = createMockContext({ taskStatus: 'success' });
			expect(restartCommand.isEnabled(ctx)).toBe(true);
		});

		it('returns true when task status is error', () => {
			const ctx = createMockContext({ taskStatus: 'error' });
			expect(restartCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('spawns the active task', () => {
			const ctx = createMockContext({ activeTask: 'build' });
			restartCommand.execute(ctx);

			expect(ctx.spawnTask).toHaveBeenCalledWith('build');
		});

		it('does nothing when no active task', () => {
			const ctx = createMockContext({ activeTask: undefined });
			restartCommand.execute(ctx);

			expect(ctx.spawnTask).not.toHaveBeenCalled();
		});

		it('spawns different task names correctly', () => {
			const ctx = createMockContext({ activeTask: 'dev' });
			restartCommand.execute(ctx);

			expect(ctx.spawnTask).toHaveBeenCalledWith('dev');
		});
	});
});
