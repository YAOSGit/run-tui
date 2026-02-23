import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { searchCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		showSearch: boolean;
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
		showSearch: overrides.showSearch ?? false,
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

describe('searchCommand', () => {
	it('should have correct ID', () => {
		expect(searchCommand.id).toBe('SEARCH');
	});

	it('should be bound to ctrl+f', () => {
		expect(searchCommand.keys[0]).toEqual({ textKey: 'f', ctrl: true });
	});

	it('should be enabled when tasks exist and search/selector are closed', () => {
		const providers = createMockProviders({
			showScriptSelector: false,
			tasks: ['task1'],
			showSearch: false,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(true);
	});

	it('should be disabled when selector is open', () => {
		const providers = createMockProviders({
			showScriptSelector: true,
			tasks: ['task1'],
			showSearch: false,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should be disabled when search is already open', () => {
		const providers = createMockProviders({
			showScriptSelector: false,
			tasks: ['task1'],
			showSearch: true,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should call openSearch on execute', () => {
		const providers = createMockProviders();
		searchCommand.execute(providers);
		expect(providers.view.openSearch).toHaveBeenCalled();
	});
});
