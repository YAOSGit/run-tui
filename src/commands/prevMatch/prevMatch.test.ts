import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { prevMatchCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showSearch: boolean;
		searchQuery: string;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: ['task1'],
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
		showSearch: overrides.showSearch ?? false,
		searchQuery: overrides.searchQuery ?? 'test',
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
		showScriptSelector: false,
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

describe('prevMatchCommand', () => {
	it('should have correct ID', () => {
		expect(prevMatchCommand.id).toBe('PREV_MATCH');
	});

	it('should be enabled when a search query exists and search is closed', () => {
		const providers = createMockProviders({
			showSearch: false,
			searchQuery: 'test',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(true);
	});

	it('should be disabled when search is open', () => {
		const providers = createMockProviders({
			showSearch: true,
			searchQuery: 'test',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should be disabled when there is no query', () => {
		const providers = createMockProviders({
			showSearch: false,
			searchQuery: '',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(false);
	});
});
