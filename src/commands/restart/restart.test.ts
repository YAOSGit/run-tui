import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import { restartCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		activeTask: string | undefined;
		taskStatus: TaskStatus | undefined;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: overrides.tasks ?? ['task1'],
		taskStates: {},
		pinnedTasks: [],
		tabAliases: {},
		hasRunningTasks: false,
		addTask: vi.fn(),
		closeTask: vi.fn(),
		restartTask: vi.fn(),
		killTask: vi.fn(),
		killAllTasks: vi.fn(),
		cancelRestart: vi.fn(),
		markStderrSeen: vi.fn(),
		toggleTaskPin: vi.fn(),
		renameTask: vi.fn(),
		moveTaskLeft: vi.fn(),
		moveTaskRight: vi.fn(),
		getTaskStatus: vi.fn().mockReturnValue(overrides.taskStatus ?? 'success'),
	},
	logs: {
		addLog: vi.fn(),
		getLogsForTask: vi.fn().mockReturnValue([]),
		getLogCountForTask: vi.fn().mockReturnValue(0),
		clearLogsForTask: vi.fn(),
	},
	view: {
		activeTabIndex: 0,
		activeTask: 'activeTask' in overrides ? overrides.activeTask : 'task1',
		logFilter: null,
		primaryScrollOffset: 0,
		primaryAutoScroll: true,
		splitScrollOffset: 0,
		splitAutoScroll: true,
		splitTaskName: null,
		activePane: 'primary',
		showTimestamps: false,
		showSearch: false,
		searchQuery: '',
		searchMatches: [],
		currentMatchIndex: -1,
		showRenameInput: false,
		viewHeight: 20,
		totalLogs: 10,
		focusMode: false,
		displayMode: 'full' as const,
		navigateLeft: vi.fn(),
		navigateRight: vi.fn(),
		setActiveTabIndex: vi.fn(),
		cycleLogFilter: vi.fn(),
		scrollUp: vi.fn(),
		scrollDown: vi.fn(),
		scrollToBottom: vi.fn(),
		nextMatch: vi.fn(),
		prevMatch: vi.fn(),
		toggleTimestamps: vi.fn(),
		openSearch: vi.fn(),
		closeSearch: vi.fn(),
		openRenameInput: vi.fn(),
		closeRenameInput: vi.fn(),
		setSearchQuery: vi.fn(),
		scrollToIndex: vi.fn(),
		toggleFocusMode: vi.fn(),
		toggleDisplayMode: vi.fn(),
		cyclePaneFocus: vi.fn(),
	},
	ui: {
		showScriptSelector: overrides.showScriptSelector ?? false,
		showHelp: false,
		pendingConfirmation: null,
		lineOverflow: 'wrap' as const,
		openScriptSelector: vi.fn(),
		closeScriptSelector: vi.fn(),
		requestConfirmation: vi.fn(),
		confirmPending: vi.fn(),
		cancelPending: vi.fn(),
		cycleLineOverflow: vi.fn(),
		openHelp: vi.fn(),
		closeHelp: vi.fn(),
		toggleHelp: vi.fn(),
	},
	keepAlive: false,
	quit: vi.fn(),
});

describe('restartCommand', () => {
	it('has correct id', () => {
		expect(restartCommand.id).toBe('RESTART');
	});

	it('has correct keys', () => {
		expect(restartCommand.keys).toEqual([{ textKey: 'r', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(restartCommand.displayText).toBe('restart');
	});

	describe('isEnabled', () => {
		it('returns true when task status is success', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is error', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'error',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is running', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls restartTask with active task when not running', () => {
			const providers = createMockProviders({
				activeTask: 'task1',
				taskStatus: 'success',
			});
			restartCommand.execute(providers);
			expect(providers.tasks.killTask).not.toHaveBeenCalled();
			expect(providers.tasks.restartTask).toHaveBeenCalledOnce();
			expect(providers.tasks.restartTask).toHaveBeenCalledWith('task1');
		});

		it('kills then restarts task when task is running', () => {
			const providers = createMockProviders({
				activeTask: 'task1',
				taskStatus: 'running',
			});
			restartCommand.execute(providers);
			expect(providers.tasks.killTask).toHaveBeenCalledOnce();
			expect(providers.tasks.killTask).toHaveBeenCalledWith('task1');
			expect(providers.tasks.restartTask).toHaveBeenCalledOnce();
			expect(providers.tasks.restartTask).toHaveBeenCalledWith('task1');
		});

		it('does not call restartTask when no active task', () => {
			const providers = createMockProviders({
				activeTask: undefined,
			});
			restartCommand.execute(providers);
			expect(providers.tasks.restartTask).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns true when task is running', () => {
			const providers = createMockProviders({ taskStatus: 'running' });
			expect(restartCommand.needsConfirmation?.(providers)).toBe(true);
		});

		it('returns false when task is not running', () => {
			const providers = createMockProviders({ taskStatus: 'success' });
			expect(restartCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
