import { describe, expect, it, vi } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { leftArrowCommand, rightArrowCommand } from './index.js';

const createMockProviders = (
	overrides: Partial<{
		showScriptSelector: boolean;
		tasks: string[];
	}> = {},
): CommandProviders => ({
	tasks: {
		tasks: overrides.tasks ?? ['task1'],
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

describe('leftArrowCommand', () => {
	it('has correct id', () => {
		expect(leftArrowCommand.id).toBe('LEFT_ARROW');
	});

	it('has correct keys', () => {
		expect(leftArrowCommand.keys).toEqual([{ specialKey: 'left' }]);
	});

	it('has correct displayKey', () => {
		expect(leftArrowCommand.displayKey).toBe('← / →');
	});

	it('has correct displayText', () => {
		expect(leftArrowCommand.displayText).toBe('switch');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls navigateLeft', () => {
			const providers = createMockProviders();
			leftArrowCommand.execute(providers);
			expect(providers.view.navigateLeft).toHaveBeenCalledOnce();
		});
	});
});

describe('rightArrowCommand', () => {
	it('has correct id', () => {
		expect(rightArrowCommand.id).toBe('RIGHT_ARROW');
	});

	it('has correct keys', () => {
		expect(rightArrowCommand.keys).toEqual([{ specialKey: 'right' }]);
	});

	it('has correct displayKey', () => {
		expect(rightArrowCommand.displayKey).toBe('← / →');
	});

	it('has correct displayText', () => {
		expect(rightArrowCommand.displayText).toBe('switch');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockProviders({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockProviders({
				showScriptSelector: false,
				tasks: [],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls navigateRight', () => {
			const providers = createMockProviders();
			rightArrowCommand.execute(providers);
			expect(providers.view.navigateRight).toHaveBeenCalledOnce();
		});
	});
});
