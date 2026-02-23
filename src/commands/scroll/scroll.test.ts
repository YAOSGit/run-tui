import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import {
	scrollDownCommand,
	scrollToBottomCommand,
	scrollUpCommand,
} from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		totalLogs: number;
		viewHeight: number;
		scrollOffset: number;
		autoScroll: boolean;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: overrides.tasks ?? ['task1'],
		pinnedTasks: [],
		taskStates: {},
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
		primaryScrollOffset: overrides.scrollOffset ?? 0,
		primaryAutoScroll: overrides.autoScroll ?? true,
		splitScrollOffset: Math.floor((overrides.scrollOffset ?? 0) / 2),
		splitAutoScroll: overrides.autoScroll ?? true,
		splitTaskName: null,
		activePane: 'primary',
		viewHeight: overrides.viewHeight ?? 20,
		totalLogs: overrides.totalLogs ?? 10,
		showTimestamps: false,
		showSearch: false,
		searchQuery: '',
		searchMatches: [],
		currentMatchIndex: -1,
		showRenameInput: false,
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

describe('scrollUpCommand', () => {
	it('has correct id', () => {
		expect(scrollUpCommand.id).toBe('SCROLL_UP');
	});

	it('has correct keys', () => {
		expect(scrollUpCommand.keys).toEqual([{ specialKey: 'up' }]);
	});

	it('has correct displayKey', () => {
		expect(scrollUpCommand.displayKey).toBe('↑ / ↓');
	});

	it('has correct displayText', () => {
		expect(scrollUpCommand.displayText).toBe('scroll');
	});

	describe('isEnabled', () => {
		it('returns true when can scroll up', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when content fits in view', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 10,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at top', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 30, // At max (50 - 20)
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollUp', () => {
			const providers = createMockProviders();
			scrollUpCommand.execute(providers);
			expect(providers.view.scrollUp).toHaveBeenCalledOnce();
		});
	});
});

describe('scrollDownCommand', () => {
	it('has correct id', () => {
		expect(scrollDownCommand.id).toBe('SCROLL_DOWN');
	});

	it('has correct keys', () => {
		expect(scrollDownCommand.keys).toEqual([{ specialKey: 'down' }]);
	});

	it('has correct displayKey', () => {
		expect(scrollDownCommand.displayKey).toBe('↑ / ↓');
	});

	it('has correct displayText', () => {
		expect(scrollDownCommand.displayText).toBe('scroll');
	});

	describe('isEnabled', () => {
		it('returns true when can scroll down', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when content fits in view', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 10,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at bottom', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 0, // At bottom
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollDown', () => {
			const providers = createMockProviders();
			scrollDownCommand.execute(providers);
			expect(providers.view.scrollDown).toHaveBeenCalledOnce();
		});
	});
});

describe('scrollToBottomCommand', () => {
	it('has correct id', () => {
		expect(scrollToBottomCommand.id).toBe('SCROLL_TO_BOTTOM');
	});

	it('has correct keys', () => {
		expect(scrollToBottomCommand.keys).toEqual([{ textKey: 'b' }]);
	});

	it('has correct displayText', () => {
		expect(scrollToBottomCommand.displayText).toBe('bottom');
	});

	describe('isEnabled', () => {
		it('returns true when not at bottom (autoScroll false)', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at bottom (autoScroll true)', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
				autoScroll: true,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollToBottom', () => {
			const providers = createMockProviders();
			scrollToBottomCommand.execute(providers);
			expect(providers.view.scrollToBottom).toHaveBeenCalledOnce();
		});
	});
});
