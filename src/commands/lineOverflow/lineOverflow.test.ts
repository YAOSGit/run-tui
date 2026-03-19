import { createMockDeps } from '../../test-utils/mockDeps.js';
import { lineOverflowCommand } from './index.js';

describe('lineOverflowCommand', () => {
	it('has correct id', () => {
		expect(lineOverflowCommand.id).toBe('LINE_OVERFLOW');
	});

	it('has correct keys', () => {
		expect(lineOverflowCommand.keys).toEqual([{ textKey: 'w', ctrl: true }]);
	});

	it('has correct displayText', () => {
		expect(lineOverflowCommand.displayText).toBe('wrap');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(lineOverflowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls cycleLineOverflow', () => {
			const providers = createMockDeps();
			lineOverflowCommand.execute(providers);
			expect(providers.ui.cycleLineOverflow).toHaveBeenCalledOnce();
		});
	});
});
