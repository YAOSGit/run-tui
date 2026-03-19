import { createMockDeps } from '../../test-utils/mockDeps.js';
import { filterCommand } from './index.js';

describe('filterCommand', () => {
	it('has correct id', () => {
		expect(filterCommand.id).toBe('FILTER');
	});

	it('has correct keys', () => {
		expect(filterCommand.keys).toEqual([{ textKey: 'o', ctrl: true }]);
	});

	it('has correct displayText', () => {
		expect(filterCommand.displayText).toBe('Toggle output');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(filterCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(filterCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(filterCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls cycleLogFilter', () => {
			const providers = createMockDeps();
			filterCommand.execute(providers);
			expect(providers.view.cycleLogFilter).toHaveBeenCalledOnce();
		});
	});
});
