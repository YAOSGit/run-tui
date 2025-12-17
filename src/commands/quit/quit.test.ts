import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import type { TaskState } from '../../types/TaskState/index.js';
import { quitCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		hasRunningTasks: boolean;
		keepAlive: boolean;
		taskStates: Record<string, TaskState>;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: ['task1'],
		taskStates: overrides.taskStates ?? {},
		hasRunningTasks: overrides.hasRunningTasks ?? false,
		addTask: vi.fn(),
		closeTask: vi.fn(),
		restartTask: vi.fn(),
		killTask: vi.fn(),
		killAllTasks: vi.fn(),
		markStderrSeen: vi.fn(),
		getTaskStatus: vi.fn(),
	},
	logs: {
		addLog: vi.fn(),
		getLogsForTask: vi.fn().mockReturnValue([]),
		getLogCountForTask: vi.fn().mockReturnValue(0),
		clearLogsForTask: vi.fn(),
	},
	view: {
		activeTabIndex: 0,
		activeTask: 'task1',
		logFilter: null,
		scrollOffset: 0,
		autoScroll: true,
		viewHeight: 20,
		totalLogs: 10,
		navigateLeft: vi.fn(),
		navigateRight: vi.fn(),
		setActiveTabIndex: vi.fn(),
		cycleLogFilter: vi.fn(),
		scrollUp: vi.fn(),
		scrollDown: vi.fn(),
		scrollToBottom: vi.fn(),
	},
	ui: {
		showScriptSelector: overrides.showScriptSelector ?? false,
		pendingConfirmation: null,
		openScriptSelector: vi.fn(),
		closeScriptSelector: vi.fn(),
		requestConfirmation: vi.fn(),
		confirmPending: vi.fn(),
		cancelPending: vi.fn(),
	},
	keepAlive: overrides.keepAlive ?? false,
	quit: vi.fn(),
});

describe('quitCommand', () => {
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

	describe('isEnabled', () => {
		it('returns true when script selector is hidden', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
			});
			expect(quitCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
			});
			expect(quitCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls killAllTasks and quit', () => {
			const providers = createMockProviders();
			quitCommand.execute(providers);
			expect(providers.tasks.killAllTasks).toHaveBeenCalledOnce();
			expect(providers.quit).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns true when hasRunningTasks is true', () => {
			const providers = createMockProviders({
				hasRunningTasks: true,
				keepAlive: false,
			});
			expect(quitCommand.needsConfirmation?.(providers)).toBe(true);
		});

		it('returns true when keepAlive is true', () => {
			const providers = createMockProviders({
				hasRunningTasks: false,
				keepAlive: true,
			});
			expect(quitCommand.needsConfirmation?.(providers)).toBe(true);
		});

		it('returns false when no running tasks and keepAlive is false', () => {
			const providers = createMockProviders({
				hasRunningTasks: false,
				keepAlive: false,
			});
			expect(quitCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});

	describe('confirmMessage', () => {
		it('returns message with running task count when tasks are running', () => {
			const providers = createMockProviders({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
					},
					task2: {
						name: 'task2',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(providers)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 2 running tasks?');
		});

		it('returns message with singular form for one running task', () => {
			const providers = createMockProviders({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(providers)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 1 running task?');
		});

		it('returns simple quit message when no running tasks', () => {
			const providers = createMockProviders({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'success',
						exitCode: 0,
						hasUnseenStderr: false,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(providers)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit?');
		});
	});
});
