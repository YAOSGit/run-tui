import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import { lineOverflowCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
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
		activeTask: 'task1',
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

describe('lineOverflowCommand', () => {
	it('has correct id', () => {
		expect(lineOverflowCommand.id).toBe('LINE_OVERFLOW');
	});

	it('has correct keys', () => {
		expect(lineOverflowCommand.keys).toEqual([{ textKey: 'w', ctrl: true }]);
	});

	it('has correct displayText', () => {
		expect(lineOverflowCommand.displayText).toBe('wrap');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls cycleLineOverflow', () => {
			const providers = createMockProviders();
			lineOverflowCommand.execute(providers);
			expect(providers.ui.cycleLineOverflow).toHaveBeenCalledOnce();
		});
	});
});
