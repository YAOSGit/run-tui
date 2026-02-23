import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import { killCommand } from './index.js';

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
		pinnedTasks: [],
		tabAliases: {},
		taskStates: {},
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
		getTaskStatus: vi.fn().mockReturnValue(overrides.taskStatus ?? 'running'),
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

describe('killCommand', () => {
	it('has correct id', () => {
		expect(killCommand.id).toBe('KILL');
	});

	it('has correct keys', () => {
		expect(killCommand.keys).toEqual([{ textKey: 'k', ctrl: false, shift: false }]);
	});

	it('has correct displayText', () => {
		expect(killCommand.displayText).toBe('kill');
	});

	describe('isEnabled', () => {
		it('returns true when task status is running', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(killCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when task status is success', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when task status is error', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'error',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls killTask with active task', () => {
			const providers = createMockProviders({
				activeTask: 'task1',
			});
			killCommand.execute(providers);
			expect(providers.tasks.killTask).toHaveBeenCalledOnce();
			expect(providers.tasks.killTask).toHaveBeenCalledWith('task1');
		});

		it('does not call killTask when no active task', () => {
			const providers = createMockProviders({
				activeTask: undefined,
			});
			killCommand.execute(providers);
			expect(providers.tasks.killTask).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('always returns true', () => {
			const providers = createMockProviders();
			expect(killCommand.needsConfirmation?.(providers)).toBe(true);
		});
	});

	describe('confirmMessage', () => {
		it('returns message with active task name', () => {
			const providers = createMockProviders({
				activeTask: 'my-task',
			});
			const message =
				typeof killCommand.confirmMessage === 'function'
					? killCommand.confirmMessage(providers)
					: killCommand.confirmMessage;
			expect(message).toBe('Kill my-task?');
		});
	});
});
