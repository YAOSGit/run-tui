import { createMockDeps } from '../../test-utils/mockDeps.js';
import { reorderTabRightCommand } from './index.js';

describe('reorderTabRightCommand', () => {
	it('has correct id', () => {
		expect(reorderTabRightCommand.id).toBe('REORDER_TAB_RIGHT');
	});

	it('has correct displayText', () => {
		expect(reorderTabRightCommand.displayText).toBe('Move tab right');
	});

	it('has correct keys', () => {
		expect(reorderTabRightCommand.keys).toEqual([
			{ textKey: 'f', meta: true },
			{ rightArrow: true, meta: true, shift: false, ctrl: false },
		]);
	});

	describe('isEnabled', () => {
		it('returns true when active task is not at the last position', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task2',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when active task is at the last position', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task3',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1', 'task2'],
				activeTask: 'task1',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when only one task exists', () => {
			const providers = createMockDeps({
				tasks: ['task1'],
				activeTask: 'task1',
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2'],
				activeTask: undefined,
			});
			expect(reorderTabRightCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls moveTaskRight with active task', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2'],
				activeTask: 'task1',
			});
			reorderTabRightCommand.execute(providers);
			expect(providers.tasks.moveTaskRight).toHaveBeenCalledOnce();
			expect(providers.tasks.moveTaskRight).toHaveBeenCalledWith('task1');
		});

		it('does not call moveTaskRight when no active task', () => {
			const providers = createMockDeps({
				activeTask: undefined,
			});
			reorderTabRightCommand.execute(providers);
			expect(providers.tasks.moveTaskRight).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockDeps();
			expect(reorderTabRightCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
