import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { cycleFocusCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		splitTaskName: string | null;
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
		splitTaskName: overrides.splitTaskName ?? null,
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

describe('cycleFocusCommand', () => {
	it('has correct id', () => {
		expect(cycleFocusCommand.id).toBe('CYCLE_FOCUS');
	});

	it('has correct keys', () => {
		expect(cycleFocusCommand.keys).toEqual([{ specialKey: 'tab' }]);
	});

	it('has correct displayText', () => {
		expect(cycleFocusCommand.displayText).toBe('Cycle Focus');
	});

	describe('isEnabled', () => {
		it('returns true when split mode is active', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				splitTaskName: 'task2',
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when split mode is not active', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				splitTaskName: null,
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				splitTaskName: 'task2',
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls cyclePaneFocus', () => {
			const providers = createMockProviders({ splitTaskName: 'task2' });
			cycleFocusCommand.execute(providers);
			expect(providers.view.cyclePaneFocus).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockProviders();
			expect(cycleFocusCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
