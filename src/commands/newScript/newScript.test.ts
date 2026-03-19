import { createMockDeps } from '../../test-utils/mockDeps.js';
import { newScriptCommand } from './index.js';

describe('newScriptCommand', () => {
	it('has correct id', () => {
		expect(newScriptCommand.id).toBe('NEW_SCRIPT');
	});

	it('has correct keys', () => {
		expect(newScriptCommand.keys).toEqual([{ textKey: 'n', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(newScriptCommand.displayText).toBe('new');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
			});
			expect(newScriptCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
			});
			expect(newScriptCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls openScriptSelector', () => {
			const providers = createMockDeps();
			newScriptCommand.execute(providers);
			expect(providers.ui.openScriptSelector).toHaveBeenCalledOnce();
		});
	});
});
