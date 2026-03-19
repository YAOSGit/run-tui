import { createMockDeps } from '../../test-utils/mockDeps.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { clearAllLogsCommand, clearCurrentLogsCommand } from './index.js';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('clearCurrentLogsCommand', () => {
	it('has correct id', () => {
		expect(clearCurrentLogsCommand.id).toBe('CLEAR_CURRENT_LOGS');
	});

	it('has correct key (l with ctrl)', () => {
		expect(clearCurrentLogsCommand.keys).toEqual([
			{ textKey: 'l', ctrl: true, shift: false },
		]);
	});

	it('has correct displayText', () => {
		expect(clearCurrentLogsCommand.displayText).toBe('clear log');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector hidden', () => {
			expect(clearCurrentLogsCommand.isEnabled(createMockDeps())).toBe(
				true,
			);
		});

		it('returns false when script selector is shown', () => {
			expect(
				clearCurrentLogsCommand.isEnabled(
					createMockDeps({ showScriptSelector: true }),
				),
			).toBe(false);
		});

		it('returns false when no tasks', () => {
			expect(
				clearCurrentLogsCommand.isEnabled(createMockDeps({ tasks: [] })),
			).toBe(false);
		});
	});

	describe('execute', () => {
		it('clears logs and adds a divider for the active task', () => {
			const providers = createMockDeps();
			clearCurrentLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).toHaveBeenCalledWith('task1');
			expect(providers.logs.addLog).toHaveBeenCalledWith(
				expect.objectContaining({ task: 'task1', type: LOG_TYPE.DIVIDER }),
			);
			expect(providers.view.scrollToBottom).toHaveBeenCalled();
		});

		it('does nothing if no active task', () => {
			const providers = createMockDeps({ activeTask: undefined });
			clearCurrentLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).not.toHaveBeenCalled();
		});
	});
});

describe('clearAllLogsCommand', () => {
	it('has correct id', () => {
		expect(clearAllLogsCommand.id).toBe('CLEAR_ALL_LOGS');
	});

	it('has correct key (L with shift)', () => {
		expect(clearAllLogsCommand.keys).toEqual([
			{ textKey: 'L', ctrl: false, shift: true },
		]);
	});

	it('has correct displayText', () => {
		expect(clearAllLogsCommand.displayText).toBe('clear all');
	});

	describe('execute', () => {
		it('clears and adds divider for every task', () => {
			const providers = createMockDeps({ tasks: ['task1', 'task2'] });
			clearAllLogsCommand.execute(providers);
			expect(providers.logs.clearLogsForTask).toHaveBeenCalledTimes(2);
			expect(providers.logs.addLog).toHaveBeenCalledTimes(2);
			expect(providers.view.scrollToBottom).toHaveBeenCalled();
		});
	});
});
