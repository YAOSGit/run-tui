import { createMockDeps } from '../../test-utils/mockDeps.js';
import { restartCommand } from './index.js';

describe('restartCommand', () => {
	it('has correct id', () => {
		expect(restartCommand.id).toBe('RESTART');
	});

	it('has correct keys', () => {
		expect(restartCommand.keys).toEqual([{ textKey: 'r', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(restartCommand.displayText).toBe('restart');
	});

	describe('isEnabled', () => {
		it('returns true when task status is success', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is error', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'error',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is running', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(restartCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(restartCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls restartTask with active task when not running', () => {
			const providers = createMockDeps({
				activeTask: 'task1',
				taskStatus: 'success',
			});
			restartCommand.execute(providers);
			expect(providers.tasks.killTask).not.toHaveBeenCalled();
			expect(providers.tasks.restartTask).toHaveBeenCalledOnce();
			expect(providers.tasks.restartTask).toHaveBeenCalledWith('task1');
		});

		it('kills then restarts task when task is running', () => {
			const providers = createMockDeps({
				activeTask: 'task1',
				taskStatus: 'running',
			});
			restartCommand.execute(providers);
			expect(providers.tasks.killTask).toHaveBeenCalledOnce();
			expect(providers.tasks.killTask).toHaveBeenCalledWith('task1');
			expect(providers.tasks.restartTask).toHaveBeenCalledOnce();
			expect(providers.tasks.restartTask).toHaveBeenCalledWith('task1');
		});

		it('does not call restartTask when no active task', () => {
			const providers = createMockDeps({
				activeTask: undefined,
			});
			restartCommand.execute(providers);
			expect(providers.tasks.restartTask).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns true when task is running', () => {
			const providers = createMockDeps({ taskStatus: 'running' });
			expect(restartCommand.needsConfirmation?.(providers)).toBe(true);
		});

		it('returns false when task is not running', () => {
			const providers = createMockDeps({ taskStatus: 'success' });
			expect(restartCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
