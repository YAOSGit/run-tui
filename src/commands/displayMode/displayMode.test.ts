import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { displayModeCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		pinnedTasks: string[];
		displayMode: 'full' | 'compact';
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: overrides.tasks ?? ['task1'],
		pinnedTasks: overrides.pinnedTasks ?? [],
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
		displayMode: overrides.displayMode ?? ('full' as const),
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

describe('displayModeCommand', () => {
	it('has correct id', () => {
		expect(displayModeCommand.id).toBe('DISPLAY_MODE');
	});

	it('has correct displayText', () => {
		expect(displayModeCommand.displayText).toBe('Compact Mode');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector is hidden', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls toggleDisplayMode', () => {
			const providers = createMockProviders();
			displayModeCommand.execute(providers);
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('unpins all pinned tasks when switching from full to compact', () => {
			const providers = createMockProviders({
				displayMode: 'full',
				pinnedTasks: ['task1', 'task2'],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledTimes(2);
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledWith('task1');
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledWith('task2');
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('does not unpin tasks when switching from compact to full', () => {
			const providers = createMockProviders({
				displayMode: 'compact',
				pinnedTasks: ['task1'],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).not.toHaveBeenCalled();
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('does not unpin tasks when in full mode with no pinned tasks', () => {
			const providers = createMockProviders({
				displayMode: 'full',
				pinnedTasks: [],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).not.toHaveBeenCalled();
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockProviders();
			expect(displayModeCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
