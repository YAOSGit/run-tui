import { createMockDeps } from '../../test-utils/mockDeps.js';
import { togglePinCommand } from './index.js';

describe('togglePinCommand', () => {
	it('has correct id', () => {
		expect(togglePinCommand.id).toBe('TOGGLE_PIN');
	});

	it('has correct displayText', () => {
		expect(togglePinCommand.displayText).toBe('Pin Tab');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector is hidden', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(togglePinCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(togglePinCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(togglePinCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls toggleTaskPin with active task', () => {
			const providers = createMockDeps({ activeTask: 'task1' });
			togglePinCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledOnce();
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledWith('task1');
		});

		it('does not call toggleTaskPin when no active task', () => {
			const providers = createMockDeps({ activeTask: undefined });
			togglePinCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockDeps();
			expect(togglePinCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
