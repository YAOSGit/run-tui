import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { reorderTabRightCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		activeTask: string | undefined;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: overrides.tasks ?? ['task1', 'task2', 'task3'],
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
		activeTask: 'activeTask' in overrides ? overrides.activeTask : 'task2',
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

describe('reorderTabRightCommand', () => {
	it('has correct id', () => {
		expect(reorderTabRightCommand.id).toBe('REORDER_TAB_RIGHT');
	});

	it('has correct displayText', () => {
		expect(reorderTabRightCommand.displayText).toBe('Move tab right');
	});

	it('has correct keys', () => {
		expect(reorderTabRightCommand.keys).toEqual([
			{ textKey: 'f', meta: true },
			{ rightArrow: true, meta: true, shift: false, ctrl: false },
		]);
	});

	describe('isEnabled', () => {
		it('returns true when active task is not at the last position', () => {
			const providers = createMockProviders({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task2',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when active task is at the last position', () => {
			const providers = createMockProviders({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task3',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1', 'task2'],
				activeTask: 'task1',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when only one task exists', () => {
			const providers = createMockProviders({
				tasks: ['task1'],
				activeTask: 'task1',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockProviders({
				tasks: ['task1', 'task2'],
				activeTask: undefined,
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls moveTaskRight with active task', () => {
			const providers = createMockProviders({
				tasks: ['task1', 'task2'],
				activeTask: 'task1',
			});
			reorderTabRightCommand.execute(providers);
			expect(providers.tasks.moveTaskRight).toHaveBeenCalledOnce();
			expect(providers.tasks.moveTaskRight).toHaveBeenCalledWith('task1');
		});

		it('does not call moveTaskRight when no active task', () => {
			const providers = createMockProviders({
				activeTask: undefined,
			});
			reorderTabRightCommand.execute(providers);
			expect(providers.tasks.moveTaskRight).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockProviders();
			expect(reorderTabRightCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
