import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { newScriptCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: ['task1'],
		taskStates: {},
		hasRunningTasks: false,
		addTask: vi.fn(),
		closeTask: vi.fn(),
		restartTask: vi.fn(),
		killTask: vi.fn(),
		killAllTasks: vi.fn(),
		markStderrSeen: vi.fn(),
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
		scrollOffset: 0,
		autoScroll: true,
		viewHeight: 20,
		totalLogs: 10,
		navigateLeft: vi.fn(),
		navigateRight: vi.fn(),
		setActiveTabIndex: vi.fn(),
		cycleLogFilter: vi.fn(),
		scrollUp: vi.fn(),
		scrollDown: vi.fn(),
		scrollToBottom: vi.fn(),
	},
	ui: {
		showScriptSelector: overrides.showScriptSelector ?? false,
		pendingConfirmation: null,
		openScriptSelector: vi.fn(),
		closeScriptSelector: vi.fn(),
		requestConfirmation: vi.fn(),
		confirmPending: vi.fn(),
		cancelPending: vi.fn(),
	},
	keepAlive: false,
	quit: vi.fn(),
});

describe('newScriptCommand', () => {
	it('has correct id', () => {
		expect(newScriptCommand.id).toBe('NEW_SCRIPT');
	});

	it('has correct keys', () => {
		expect(newScriptCommand.keys).toEqual([{ textKey: 'n', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(newScriptCommand.displayText).toBe('new');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
			});
			expect(newScriptCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
			});
			expect(newScriptCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls openScriptSelector', () => {
			const providers = createMockProviders();
			newScriptCommand.execute(providers);
			expect(providers.ui.openScriptSelector).toHaveBeenCalledOnce();
		});
	});
});
