import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import * as exportUtils from '../../utils/exportLogs/index.js';
import {
	copyCurrentLogsCommand,
	exportAllLogsCommand,
	exportCurrentLogsCommand,
} from './index.js';

afterEach(() => {
	vi.restoreAllMocks();
});

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
		activeTask: string | undefined;
		noActiveTask: boolean;
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
		getTaskStatus: vi.fn(),
	},
	logs: {
		addLog: vi.fn(),
		getLogsForTask: vi.fn().mockReturnValue([
			{
				id: '1',
				task: 'task1',
				text: 'hello',
				type: LOG_TYPE.STDOUT,
				timestamp: '10:00:00',
			},
		]),
		getLogCountForTask: vi.fn().mockReturnValue(1),
		clearLogsForTask: vi.fn(),
	},
	view: {
		activeTabIndex: 0,
		// Use null-safe ternary so we can pass explicit undefined
		activeTask: overrides.noActiveTask
			? undefined
			: (overrides.activeTask ?? 'task1'),
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
		totalLogs: 1,
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

describe('exportCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(exportCurrentLogsCommand.id).toBe('EXPORT_CURRENT_LOGS');
	});

	it('has correct key (e with ctrl)', () => {
		expect(exportCurrentLogsCommand.keys).toEqual([
			{ textKey: 'e', ctrl: true, shift: false },
		]);
	});

	it('has correct displayText', () => {
		expect(exportCurrentLogsCommand.displayText).toBe('save log');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector hidden', () => {
			expect(exportCurrentLogsCommand.isEnabled(createMockProviders())).toBe(
				true,
			);
		});

		it('returns false when script selector is shown', () => {
			expect(
				exportCurrentLogsCommand.isEnabled(
					createMockProviders({ showScriptSelector: true }),
				),
			).toBe(false);
		});

		it('returns false when no tasks', () => {
			expect(
				exportCurrentLogsCommand.isEnabled(createMockProviders({ tasks: [] })),
			).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls saveLogsToFile with the active task and formatted logs', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('/logs/task1.log');
			const providers = createMockProviders();

			exportCurrentLogsCommand.execute(providers);

			expect(providers.logs.getLogsForTask).toHaveBeenCalledWith('task1', null);
			expect(saveSpy).toHaveBeenCalledWith('task1', '[10:00:00] hello');
		});

		it('does nothing if no active task', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('');
			const providers = createMockProviders({ noActiveTask: true });

			exportCurrentLogsCommand.execute(providers);

			expect(saveSpy).not.toHaveBeenCalled();
		});
	});
});

describe('exportAllLogsCommand', () => {
	it('has correct id', () => {
		expect(exportAllLogsCommand.id).toBe('EXPORT_ALL_LOGS');
	});

	it('has correct key (E with shift)', () => {
		expect(exportAllLogsCommand.keys).toEqual([
			{ textKey: 'E', ctrl: false, shift: true },
		]);
	});

	it('has correct displayText', () => {
		expect(exportAllLogsCommand.displayText).toBe('save all');
	});

	describe('execute', () => {
		it('calls saveLogsToFile for each task', () => {
			const saveSpy = vi
				.spyOn(exportUtils, 'saveLogsToFile')
				.mockResolvedValue('');
			const providers = createMockProviders({ tasks: ['task1', 'task2'] });

			exportAllLogsCommand.execute(providers);

			expect(saveSpy).toHaveBeenCalledTimes(2);
			expect(saveSpy).toHaveBeenCalledWith('task1', expect.any(String));
			expect(saveSpy).toHaveBeenCalledWith('task2', expect.any(String));
		});
	});
});

describe('copyCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(copyCurrentLogsCommand.id).toBe('COPY_CURRENT_LOGS');
	});

	it('has correct key (y with ctrl)', () => {
		expect(copyCurrentLogsCommand.keys).toEqual([{ textKey: 'y', ctrl: true }]);
	});

	it('has correct displayText', () => {
		expect(copyCurrentLogsCommand.displayText).toBe('copy log');
	});

	describe('execute', () => {
		it('calls copyToClipboard with formatted logs', () => {
			const clipSpy = vi
				.spyOn(exportUtils, 'copyToClipboard')
				.mockResolvedValue(undefined);
			const providers = createMockProviders();

			copyCurrentLogsCommand.execute(providers);

			expect(clipSpy).toHaveBeenCalledWith('[10:00:00] hello');
		});

		it('does nothing if no active task', () => {
			const clipSpy = vi
				.spyOn(exportUtils, 'copyToClipboard')
				.mockResolvedValue(undefined);
			const providers = createMockProviders({ noActiveTask: true });

			copyCurrentLogsCommand.execute(providers);

			expect(clipSpy).not.toHaveBeenCalled();
		});
	});
});
