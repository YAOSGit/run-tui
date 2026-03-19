import { createMockDeps } from '../../test-utils/mockDeps.js';
import { reorderTabLeftCommand } from './index.js';

describe('reorderTabLeftCommand', () => {
	it('has correct id', () => {
		expect(reorderTabLeftCommand.id).toBe('REORDER_TAB_LEFT');
	});

	it('has correct displayText', () => {
		expect(reorderTabLeftCommand.displayText).toBe('Move tab left');
	});

	it('has correct keys', () => {
		expect(reorderTabLeftCommand.keys).toEqual([
			{ textKey: 'b', meta: true },
			{ leftArrow: true, meta: true, shift: false, ctrl: false },
		]);
	});

	describe('isEnabled', () => {
		it('returns true when active task is not at the first position', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task2',
			});
			expect(reorderTabLeftCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when active task is at the first position', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2', 'task3'],
				activeTask: 'task1',
			});
			expect(reorderTabLeftCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1', 'task2'],
				activeTask: 'task2',
			});
			expect(reorderTabLeftCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when only one task exists', () => {
			const providers = createMockDeps({
				tasks: ['task1'],
				activeTask: 'task1',
			});
			expect(reorderTabLeftCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no active task', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2'],
				activeTask: undefined,
			});
			expect(reorderTabLeftCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls moveTaskLeft with active task', () => {
			const providers = createMockDeps({
				tasks: ['task1', 'task2'],
				activeTask: 'task2',
			});
			reorderTabLeftCommand.execute(providers);
			expect(providers.tasks.moveTaskLeft).toHaveBeenCalledOnce();
			expect(providers.tasks.moveTaskLeft).toHaveBeenCalledWith('task2');
		});

		it('does not call moveTaskLeft when no active task', () => {
			const providers = createMockDeps({
				activeTask: undefined,
			});
			reorderTabLeftCommand.execute(providers);
			expect(providers.tasks.moveTaskLeft).not.toHaveBeenCalled();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockDeps();
			expect(reorderTabLeftCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
