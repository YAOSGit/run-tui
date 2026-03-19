import { createMockDeps } from '../../test-utils/mockDeps.js';
import { closeTabCommand } from './index.js';

describe('closeTabCommand', () => {
	it('has correct id', () => {
		expect(closeTabCommand.id).toBe('CLOSE_TAB');
	});

	it('has correct keys', () => {
		expect(closeTabCommand.keys).toEqual([{ textKey: 'x', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(closeTabCommand.displayText).toBe('close');
	});

	describe('isEnabled', () => {
		it('returns true when task status is success', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is error', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'error',
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(true);
		});

		it('returns true when task status is running', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'running',
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				activeTask: 'task1',
				taskStatus: 'success',
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				activeTask: undefined,
				taskStatus: undefined,
			});
			expect(closeTabCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls closeTask with active task', () => {
			const providers = createMockDeps({
				activeTask: 'task1',
				taskStatus: 'success',
			});
			closeTabCommand.execute(providers);
			expect(providers.tasks.killTask).not.toHaveBeenCalled();
			expect(providers.tasks.closeTask).toHaveBeenCalledOnce();
			expect(providers.tasks.closeTask).toHaveBeenCalledWith('task1');
		});

		it('kills then closes task when task is running', () => {
			const providers = createMockDeps({
				activeTask: 'task1',
				taskStatus: 'running',
			});
			closeTabCommand.execute(providers);
			expect(providers.tasks.killTask).toHaveBeenCalledOnce();
			expect(providers.tasks.killTask).toHaveBeenCalledWith('task1');
			expect(providers.tasks.closeTask).toHaveBeenCalledOnce();
			expect(providers.tasks.closeTask).toHaveBeenCalledWith('task1');
		});

		it('does not call closeTask when no active task', () => {
			const providers = createMockDeps({
				activeTask: undefined,
			});
			closeTabCommand.execute(providers);
			expect(providers.tasks.closeTask).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('always returns true', () => {
			const providers = createMockDeps({ taskStatus: 'success' });
			expect(closeTabCommand.needsConfirmation?.(providers)).toBe(true);
		});
	});
});
