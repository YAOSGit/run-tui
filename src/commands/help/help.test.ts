import { describe, expect, it } from 'vitest';
import { createMockDeps } from '../../test-utils/mockDeps.js';
import { helpCommand } from './index.js';

describe('helpCommand', () => {
	it('has correct id', () => {
		expect(helpCommand.id).toBe('HELP');
	});

	it('has correct keys', () => {
		expect(helpCommand.keys).toEqual([{ textKey: 'h', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(helpCommand.displayText).toBe('help');
	});

	describe('isEnabled', () => {
		it('returns true always', () => {
			const deps = createMockDeps();
			expect(helpCommand.isEnabled(deps)).toBe(true);
		});

		it('returns true even when script selector is shown', () => {
			const deps = createMockDeps({ showScriptSelector: true });
			expect(helpCommand.isEnabled(deps)).toBe(true);
		});
	});

	describe('execute', () => {
		it('calls toggleHelp', () => {
			const deps = createMockDeps();
			helpCommand.execute(deps);
			expect(deps.ui.toggleHelp).toHaveBeenCalledOnce();
		});
	});
});
