import { createMockDeps } from '../../test-utils/mockDeps.js';
import { renameTabCommand } from './index.js';

describe('renameTabCommand', () => {
	it('has correct id', () => {
		expect(renameTabCommand.id).toBe('RENAME_TAB');
	});

	it('has correct keys', () => {
		expect(renameTabCommand.keys).toEqual([{ textKey: 'e', ctrl: false }]);
	});

	it('has correct displayText', () => {
		expect(renameTabCommand.displayText).toBe('rename tab');
	});

	describe('isEnabled', () => {
		it('returns true when there is an active task', () => {
			const providers = createMockDeps({ activeTask: 'task1' });
			expect(renameTabCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when there is no active task', () => {
			const providers = createMockDeps({ activeTask: undefined });
			expect(renameTabCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls openRenameInput', () => {
			const providers = createMockDeps();
			renameTabCommand.execute(providers);
			expect(providers.view.openRenameInput).toHaveBeenCalledOnce();
		});
	});
});
