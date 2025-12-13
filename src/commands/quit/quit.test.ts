import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { quitCommand } from './index.js';

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
	killProcess: vi.fn(),
	spawnTask: vi.fn(),
	handleQuit: vi.fn(),
	setShowScriptSelector: vi.fn(),
	setLogFilter: vi.fn(),
	removeTask: vi.fn(),
	setRunningTasks: vi.fn(),
	setActiveTabIndex: vi.fn(),
	markStderrSeen: vi.fn(),
	...overrides,
});

describe('quitCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(quitCommand.id).toBe('QUIT');
		});

		it('has correct keys', () => {
			expect(quitCommand.keys).toEqual([
				{ textKey: 'q', ctrl: false },
				{ specialKey: 'esc', ctrl: false },
			]);
		});

		it('has correct displayText', () => {
			expect(quitCommand.displayText).toBe('quit');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(quitCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when script selector is hidden', () => {
			const ctx = createMockContext({ showScriptSelector: false });
			expect(quitCommand.isEnabled(ctx)).toBe(true);
		});

		it('returns true even when no running tasks', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: [],
			});
			expect(quitCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('calls handleQuit', () => {
			const ctx = createMockContext();
			quitCommand.execute(ctx);

			expect(ctx.handleQuit).toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns true when there are running tasks', () => {
			const ctx = createMockContext({ hasRunningTasks: true });
			expect(quitCommand.needsConfirmation?.(ctx)).toBe(true);
		});

		it('returns true when keepAlive is true', () => {
			const ctx = createMockContext({ hasRunningTasks: false, keepAlive: true });
			expect(quitCommand.needsConfirmation?.(ctx)).toBe(true);
		});

		it('returns false when no running tasks and keepAlive is false', () => {
			const ctx = createMockContext({
				hasRunningTasks: false,
				keepAlive: false,
			});
			expect(quitCommand.needsConfirmation?.(ctx)).toBe(false);
		});
	});

	describe('confirmMessage', () => {
		it('returns generic quit message when no running tasks', () => {
			const ctx = createMockContext({
				taskStatus: 'success',
				runningTasks: ['build'],
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(ctx)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit?');
		});

		it('returns message with count when there are running tasks', () => {
			const ctx = createMockContext({
				taskStatus: 'running',
				runningTasks: ['build'],
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(ctx)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 1 running task?');
		});

		it('returns plural message for multiple running tasks', () => {
			const ctx = createMockContext({
				taskStatus: 'running',
				runningTasks: ['build', 'test', 'lint'],
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(ctx)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 3 running tasks?');
		});
	});
});
