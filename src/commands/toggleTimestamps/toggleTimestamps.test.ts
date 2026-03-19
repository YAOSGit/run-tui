import { createMockDeps } from '../../test-utils/mockDeps.js';
import { toggleTimestampsCommand } from './index.js';

describe('toggleTimestampsCommand', () => {
	it('has correct id', () => {
		expect(toggleTimestampsCommand.id).toBe('TOGGLE_TIMESTAMPS');
	});

	it('has correct keys', () => {
		expect(toggleTimestampsCommand.keys).toEqual([
			{ textKey: 't', ctrl: true },
		]);
	});

	it('has correct displayText', () => {
		expect(toggleTimestampsCommand.displayText).toBe('time');
	});

	describe('isEnabled', () => {
		it('returns true when tasks exist and selector is hidden', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(toggleTimestampsCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(toggleTimestampsCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(toggleTimestampsCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls toggleTimestamps', () => {
			const providers = createMockDeps();
			toggleTimestampsCommand.execute(providers);
			expect(providers.view.toggleTimestamps).toHaveBeenCalledOnce();
		});
	});
});
