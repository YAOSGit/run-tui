import type { Key } from 'ink';
import { describe, expect, it } from 'vitest';
import type { KeyBinding } from '../../types/KeyBinding/index.js';
import { isKeyMatch } from './useCommandRegistry.utils.js';

const createMockKey = (overrides: Partial<Key> = {}): Key => ({
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

describe('isKeyMatch', () => {
	describe('textKey matching', () => {
		it('matches single character key', () => {
			const bindings: KeyBinding[] = [{ textKey: 'q' }];
			expect(isKeyMatch(createMockKey(), 'q', bindings)).toBe(true);
		});

		it('matches case-insensitively', () => {
			const bindings: KeyBinding[] = [{ textKey: 'Q' }];
			expect(isKeyMatch(createMockKey(), 'q', bindings)).toBe(true);
			expect(isKeyMatch(createMockKey(), 'Q', bindings)).toBe(true);
		});

		it('does not match different character', () => {
			const bindings: KeyBinding[] = [{ textKey: 'q' }];
			expect(isKeyMatch(createMockKey(), 'x', bindings)).toBe(false);
		});

		it('matches any of multiple bindings', () => {
			const bindings: KeyBinding[] = [{ textKey: 'q' }, { textKey: 'x' }];
			expect(isKeyMatch(createMockKey(), 'q', bindings)).toBe(true);
			expect(isKeyMatch(createMockKey(), 'x', bindings)).toBe(true);
			expect(isKeyMatch(createMockKey(), 'y', bindings)).toBe(false);
		});
	});

	describe('specialKey matching', () => {
		it('matches left arrow', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'left' }];
			expect(isKeyMatch(createMockKey({ leftArrow: true }), '', bindings)).toBe(
				true,
			);
			expect(
				isKeyMatch(createMockKey({ rightArrow: true }), '', bindings),
			).toBe(false);
		});

		it('matches right arrow', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'right' }];
			expect(
				isKeyMatch(createMockKey({ rightArrow: true }), '', bindings),
			).toBe(true);
		});

		it('matches up arrow', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'up' }];
			expect(isKeyMatch(createMockKey({ upArrow: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches down arrow', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'down' }];
			expect(isKeyMatch(createMockKey({ downArrow: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches pageup', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'pageup' }];
			expect(isKeyMatch(createMockKey({ pageUp: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches pagedown', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'pagedown' }];
			expect(isKeyMatch(createMockKey({ pageDown: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches backspace', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'backspace' }];
			expect(isKeyMatch(createMockKey({ backspace: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches delete', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'delete' }];
			expect(isKeyMatch(createMockKey({ delete: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches enter/return', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'enter' }];
			expect(isKeyMatch(createMockKey({ return: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches tab', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'tab' }];
			expect(isKeyMatch(createMockKey({ tab: true }), '', bindings)).toBe(true);
		});

		it('matches escape', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'esc' }];
			expect(isKeyMatch(createMockKey({ escape: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches ctrl modifier', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'ctrl' }];
			expect(isKeyMatch(createMockKey({ ctrl: true }), '', bindings)).toBe(
				true,
			);
		});

		it('matches shift modifier', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'shift' }];
			expect(isKeyMatch(createMockKey({ shift: true }), '', bindings)).toBe(
				true,
			);
		});

		it('returns false for unknown special key', () => {
			const bindings: KeyBinding[] = [
				{ specialKey: 'unknown' as KeyBinding['specialKey'] },
			];
			expect(isKeyMatch(createMockKey(), '', bindings)).toBe(false);
		});
	});

	describe('modifier key requirements', () => {
		it('requires ctrl when specified', () => {
			const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
			expect(isKeyMatch(createMockKey({ ctrl: true }), 'c', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ ctrl: false }), 'c', bindings)).toBe(
				false,
			);
		});

		it('requires no ctrl when ctrl: false is specified', () => {
			const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: false }];
			expect(isKeyMatch(createMockKey({ ctrl: false }), 'c', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ ctrl: true }), 'c', bindings)).toBe(
				false,
			);
		});

		it('requires shift when specified', () => {
			const bindings: KeyBinding[] = [{ textKey: 'a', shift: true }];
			expect(isKeyMatch(createMockKey({ shift: true }), 'a', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ shift: false }), 'a', bindings)).toBe(
				false,
			);
		});

		it('requires meta when specified', () => {
			const bindings: KeyBinding[] = [{ textKey: 'a', meta: true }];
			expect(isKeyMatch(createMockKey({ meta: true }), 'a', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ meta: false }), 'a', bindings)).toBe(
				false,
			);
		});

		it('ignores modifiers when not specified in binding', () => {
			const bindings: KeyBinding[] = [{ textKey: 'q' }];
			// Should match regardless of modifier state when not specified
			expect(isKeyMatch(createMockKey({ ctrl: true }), 'q', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ shift: true }), 'q', bindings)).toBe(
				true,
			);
			expect(isKeyMatch(createMockKey({ meta: true }), 'q', bindings)).toBe(
				true,
			);
		});

		it('requires multiple modifiers when specified', () => {
			const bindings: KeyBinding[] = [
				{ textKey: 'c', ctrl: true, shift: true },
			];
			expect(
				isKeyMatch(createMockKey({ ctrl: true, shift: true }), 'c', bindings),
			).toBe(true);
			expect(
				isKeyMatch(createMockKey({ ctrl: true, shift: false }), 'c', bindings),
			).toBe(false);
			expect(
				isKeyMatch(createMockKey({ ctrl: false, shift: true }), 'c', bindings),
			).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('returns false for empty bindings', () => {
			const bindings: KeyBinding[] = [];
			expect(isKeyMatch(createMockKey(), 'q', bindings)).toBe(false);
		});

		it('returns false when binding has neither textKey nor specialKey', () => {
			const bindings: KeyBinding[] = [{}];
			expect(isKeyMatch(createMockKey(), 'q', bindings)).toBe(false);
		});

		it('handles special key with modifiers', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'enter', ctrl: true }];
			expect(
				isKeyMatch(createMockKey({ return: true, ctrl: true }), '', bindings),
			).toBe(true);
			expect(
				isKeyMatch(createMockKey({ return: true, ctrl: false }), '', bindings),
			).toBe(false);
		});
	});
});
