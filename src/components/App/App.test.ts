import type { Key } from 'ink';
import { describe, expect, it } from 'vitest';
import { isKeyCommand } from './App.utils.js';

describe('isKeyCommand', () => {
	const createKey = (overrides: Partial<Key> = {}): Key => ({
		upArrow: false,
		downArrow: false,
		leftArrow: false,
		rightArrow: false,
		pageDown: false,
		pageUp: false,
		return: false,
		escape: false,
		ctrl: false,
		shift: false,
		tab: false,
		backspace: false,
		delete: false,
		meta: false,
		...overrides,
	});

	describe('textKey matching', () => {
		it('matches a text key (lowercase)', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'q', [{ textKey: 'q' }]);
			expect(result).toBe(true);
		});

		it('matches a text key (case insensitive)', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'Q', [{ textKey: 'q' }]);
			expect(result).toBe(true);
		});

		it('does not match different text key', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'x', [{ textKey: 'q' }]);
			expect(result).toBe(false);
		});

		it('matches any of multiple commands', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'y', [
				{ textKey: 'y' },
				{ textKey: 'Y' },
			]);
			expect(result).toBe(true);
		});
	});

	describe('specialKey matching', () => {
		it('matches left arrow', () => {
			const key = createKey({ leftArrow: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'left' }]);
			expect(result).toBe(true);
		});

		it('matches right arrow', () => {
			const key = createKey({ rightArrow: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'right' }]);
			expect(result).toBe(true);
		});

		it('matches up arrow', () => {
			const key = createKey({ upArrow: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'up' }]);
			expect(result).toBe(true);
		});

		it('matches down arrow', () => {
			const key = createKey({ downArrow: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'down' }]);
			expect(result).toBe(true);
		});

		it('matches page up', () => {
			const key = createKey({ pageUp: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'pageup' }]);
			expect(result).toBe(true);
		});

		it('matches page down', () => {
			const key = createKey({ pageDown: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'pagedown' }]);
			expect(result).toBe(true);
		});

		it('matches backspace', () => {
			const key = createKey({ backspace: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'backspace' }]);
			expect(result).toBe(true);
		});

		it('matches delete', () => {
			const key = createKey({ delete: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'delete' }]);
			expect(result).toBe(true);
		});

		it('matches enter (return)', () => {
			const key = createKey({ return: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'enter' }]);
			expect(result).toBe(true);
		});

		it('matches tab', () => {
			const key = createKey({ tab: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'tab' }]);
			expect(result).toBe(true);
		});

		it('matches escape', () => {
			const key = createKey({ escape: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'esc' }]);
			expect(result).toBe(true);
		});

		it('matches ctrl key', () => {
			const key = createKey({ ctrl: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'ctrl' }]);
			expect(result).toBe(true);
		});

		it('matches shift key', () => {
			const key = createKey({ shift: true });
			const result = isKeyCommand(key, '', [{ specialKey: 'shift' }]);
			expect(result).toBe(true);
		});

		it('returns false for unknown special key', () => {
			const key = createKey();
			const result = isKeyCommand(key, '', [{ specialKey: 'unknown' }]);
			expect(result).toBe(false);
		});
	});

	describe('modifier key matching', () => {
		it('requires ctrl modifier when specified', () => {
			const keyWithCtrl = createKey({ ctrl: true });
			const keyWithoutCtrl = createKey({ ctrl: false });

			expect(
				isKeyCommand(keyWithCtrl, 'c', [{ textKey: 'c', ctrl: true }]),
			).toBe(true);
			expect(
				isKeyCommand(keyWithoutCtrl, 'c', [{ textKey: 'c', ctrl: true }]),
			).toBe(false);
		});

		it('requires shift modifier when specified', () => {
			const keyWithShift = createKey({ shift: true });
			const keyWithoutShift = createKey({ shift: false });

			expect(
				isKeyCommand(keyWithShift, 'a', [{ textKey: 'a', shift: true }]),
			).toBe(true);
			expect(
				isKeyCommand(keyWithoutShift, 'a', [{ textKey: 'a', shift: true }]),
			).toBe(false);
		});

		it('requires meta modifier when specified', () => {
			const keyWithMeta = createKey({ meta: true });
			const keyWithoutMeta = createKey({ meta: false });

			expect(
				isKeyCommand(keyWithMeta, 'v', [{ textKey: 'v', meta: true }]),
			).toBe(true);
			expect(
				isKeyCommand(keyWithoutMeta, 'v', [{ textKey: 'v', meta: true }]),
			).toBe(false);
		});

		it('rejects when ctrl is false but key has ctrl', () => {
			const keyWithCtrl = createKey({ ctrl: true });
			expect(
				isKeyCommand(keyWithCtrl, 'c', [{ textKey: 'c', ctrl: false }]),
			).toBe(false);
		});
	});

	describe('empty commands', () => {
		it('returns false when no textKey or specialKey is provided', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'q', [{}]);
			expect(result).toBe(false);
		});

		it('returns false for empty command array', () => {
			const key = createKey();
			const result = isKeyCommand(key, 'q', []);
			expect(result).toBe(false);
		});
	});
});
