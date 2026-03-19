import { createMockDeps } from '../../test-utils/mockDeps.js';
import { cycleFocusCommand } from './index.js';

describe('cycleFocusCommand', () => {
	it('has correct id', () => {
		expect(cycleFocusCommand.id).toBe('CYCLE_FOCUS');
	});

	it('has correct keys', () => {
		expect(cycleFocusCommand.keys).toEqual([{ specialKey: 'tab' }]);
	});

	it('has correct displayText', () => {
		expect(cycleFocusCommand.displayText).toBe('Cycle Focus');
	});

	describe('isEnabled', () => {
		it('returns true when split mode is active', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				splitTaskName: 'task2',
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when split mode is not active', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				splitTaskName: null,
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				splitTaskName: 'task2',
			});
			expect(cycleFocusCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls cyclePaneFocus', () => {
			const providers = createMockDeps({ splitTaskName: 'task2' });
			cycleFocusCommand.execute(providers);
			expect(providers.view.cyclePaneFocus).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns false', () => {
			const providers = createMockDeps();
			expect(cycleFocusCommand.needsConfirmation?.(providers)).toBe(false);
		});
	});
});
