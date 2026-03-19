import { createMockDeps } from '../../test-utils/mockDeps.js';
import { leftArrowCommand, rightArrowCommand } from './index.js';

describe('leftArrowCommand', () => {
	it('has correct id', () => {
		expect(leftArrowCommand.id).toBe('LEFT_ARROW');
	});

	it('has correct keys', () => {
		expect(leftArrowCommand.keys).toEqual([
			{ specialKey: 'left', ctrl: false, meta: false, shift: false },
		]);
	});

	it('has correct displayKey', () => {
		expect(leftArrowCommand.displayKey).toBe('← / →');
	});

	it('has correct displayText', () => {
		expect(leftArrowCommand.displayText).toBe('switch');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(leftArrowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls navigateLeft', () => {
			const providers = createMockDeps();
			leftArrowCommand.execute(providers);
			expect(providers.view.navigateLeft).toHaveBeenCalledOnce();
		});
	});
});

describe('rightArrowCommand', () => {
	it('has correct id', () => {
		expect(rightArrowCommand.id).toBe('RIGHT_ARROW');
	});

	it('has correct keys', () => {
		expect(rightArrowCommand.keys).toEqual([
			{ specialKey: 'right', ctrl: false, meta: false, shift: false },
		]);
	});

	it('has correct displayKey', () => {
		expect(rightArrowCommand.displayKey).toBe('← / →');
	});

	it('has correct displayText', () => {
		expect(rightArrowCommand.displayText).toBe('switch');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden and tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
			});
			expect(rightArrowCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls navigateRight', () => {
			const providers = createMockDeps();
			rightArrowCommand.execute(providers);
			expect(providers.view.navigateRight).toHaveBeenCalledOnce();
		});
	});
});
