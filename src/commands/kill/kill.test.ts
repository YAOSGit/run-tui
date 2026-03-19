import { createMockDeps } from '../../test-utils/mockDeps.js';
import { killCommand } from './index.js';

describe('killCommand', () => {
	it('has correct id', () => {
		expect(killCommand.id).toBe('KILL');
	});

	it('has correct keys', () => {
		expect(killCommand.keys).toEqual([
			{ textKey: 'k', ctrl: false, shift: false },
		]);
	});

	it('has correct displayText', () => {
		expect(killCommand.displayText).toBe('kill');
	});

	describe('isEnabled', () => {
		it('returns true when task status is running', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(killCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when task status is success', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when task status is error', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'error',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(killCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls killTask with active task', () => {
			const providers = createMockDeps({
				activeTask: 'task1',
			});
			killCommand.execute(providers);
			expect(providers.tasks.killTask).toHaveBeenCalledOnce();
			expect(providers.tasks.killTask).toHaveBeenCalledWith('task1');
		});

		it('does not call killTask when no active task', () => {
			const providers = createMockDeps({
				activeTask: undefined,
			});
			killCommand.execute(providers);
			expect(providers.tasks.killTask).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('always returns true', () => {
			const providers = createMockDeps();
			expect(killCommand.needsConfirmation?.(providers)).toBe(true);
		});
	});

	describe('confirmMessage', () => {
		it('returns message with active task name', () => {
			const providers = createMockDeps({
				activeTask: 'my-task',
			});
			const message =
				typeof killCommand.confirmMessage === 'function'
					? killCommand.confirmMessage(providers)
					: killCommand.confirmMessage;
			expect(message).toBe('Kill my-task?');
		});
	});
});
