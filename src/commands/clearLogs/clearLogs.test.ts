import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { clearAllLogsCommand, clearCurrentLogsCommand } from './index.js';

afterEach(() => {
	vi.restoreAllMocks();
});

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		noActiveTask: boolean;
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
		activeTask: overrides.noActiveTask ? undefined : 'task1',
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
		totalLogs: 0,
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
		lineOverflow: LINE_OVERFLOW.WRAP,
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

describe('clearCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(clearCurrentLogsCommand.id).toBe('CLEAR_CURRENT_LOGS');
	});

	it('has correct key (l with ctrl)', () => {
		expect(clearCurrentLogsCommand.keys).toEqual([
			{ textKey: 'l', ctrl: true, shift: false },
		]);
	});

	it('has correct displayText', () => {
		expect(clearCurrentLogsCommand.displayText).toBe('clear log');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector hidden', () => {
			expect(clearCurrentLogsCommand.isEnabled(createMockProviders())).toBe(
				true,
			);
		});

		it('returns false when script selector is shown', () => {
			expect(
				clearCurrentLogsCommand.isEnabled(
					createMockProviders({ showScriptSelector: true }),
				),
			).toBe(false);
		});

		it('returns false when no tasks', () => {
			expect(
				clearCurrentLogsCommand.isEnabled(createMockProviders({ tasks: [] })),
			).toBe(false);
		});
	});

	describe('execute', () => {
		it('clears logs and adds a divider for the active task', () => {
			const providers = createMockProviders();
			clearCurrentLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).toHaveBeenCalledWith('task1');
			expect(providers.logs.addLog).toHaveBeenCalledWith(
				expect.objectContaining({ task: 'task1', type: LOG_TYPE.DIVIDER }),
			);
			expect(providers.view.scrollToBottom).toHaveBeenCalled();
		});

		it('does nothing if no active task', () => {
			const providers = createMockProviders({ noActiveTask: true });
			clearCurrentLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).not.toHaveBeenCalled();
		});
	});
});

describe('clearAllLogsCommand', () => {
	it('has correct id', () => {
		expect(clearAllLogsCommand.id).toBe('CLEAR_ALL_LOGS');
	});

	it('has correct key (L with shift)', () => {
		expect(clearAllLogsCommand.keys).toEqual([
			{ textKey: 'L', ctrl: false, shift: true },
		]);
	});

	it('has correct displayText', () => {
		expect(clearAllLogsCommand.displayText).toBe('clear all');
	});

	describe('execute', () => {
		it('clears and adds divider for every task', () => {
			const providers = createMockProviders({ tasks: ['task1', 'task2'] });
			clearAllLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).toHaveBeenCalledTimes(2);
			expect(providers.logs.addLog).toHaveBeenCalledTimes(2);
			expect(providers.view.scrollToBottom).toHaveBeenCalled();
		});
	});
});
