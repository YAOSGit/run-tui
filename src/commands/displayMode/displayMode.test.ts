import { createMockDeps } from '../../test-utils/mockDeps.js';
import { displayModeCommand } from './index.js';

describe('displayModeCommand', () => {
	it('has correct id', () => {
		expect(displayModeCommand.id).toBe('DISPLAY_MODE');
	});

	it('has correct displayText', () => {
		expect(displayModeCommand.displayText).toBe('Compact Mode');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector is hidden', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(displayModeCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls toggleDisplayMode', () => {
			const providers = createMockDeps();
			displayModeCommand.execute(providers);
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('unpins all pinned tasks when switching from full to compact', () => {
			const providers = createMockDeps({
				displayMode: 'full',
				pinnedTasks: ['task1', 'task2'],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledTimes(2);
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledWith('task1');
			expect(providers.tasks.toggleTaskPin).toHaveBeenCalledWith('task2');
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('does not unpin tasks when switching from compact to full', () => {
			const providers = createMockDeps({
				displayMode: 'compact',
				pinnedTasks: ['task1'],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).not.toHaveBeenCalled();
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});

		it('does not unpin tasks when in full mode with no pinned tasks', () => {
			const providers = createMockDeps({
				displayMode: 'full',
				pinnedTasks: [],
			});
			displayModeCommand.execute(providers);
			expect(providers.tasks.toggleTaskPin).not.toHaveBeenCalled();
			expect(providers.view.toggleDisplayMode).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockDeps();
			expect(displayModeCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
