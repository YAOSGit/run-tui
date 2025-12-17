import type { Key } from 'ink';
import { describe, expect, it } from 'vitest';
import type { KeyBinding } from '../../types/KeyBinding/index.js';
import { getDisplayKey, isKeyMatch } from './CommandsProvider.utils.js';

const createDefaultKey = (): Key => ({
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
});

describe('CommandsProvider.utils', () => {
	describe('isKeyMatch', () => {
		describe('textKey matching', () => {
			it('matches single character key', () => {
				const bindings: KeyBinding[] = [{ textKey: 'q', ctrl: false }];
				const result = isKeyMatch(createDefaultKey(), 'q', bindings);
				expect(result).toBe(true);
			});

			it('matches case-insensitively', () => {
				const bindings: KeyBinding[] = [{ textKey: 'q', ctrl: false }];
				const result = isKeyMatch(createDefaultKey(), 'Q', bindings);
				expect(result).toBe(true);
			});

			it('does not match different character', () => {
				const bindings: KeyBinding[] = [{ textKey: 'q', ctrl: false }];
				const result = isKeyMatch(createDefaultKey(), 'x', bindings);
				expect(result).toBe(false);
			});
		});

		describe('specialKey matching', () => {
			it('matches left arrow', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'left', ctrl: false }];
				const key = { ...createDefaultKey(), leftArrow: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches right arrow', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'right', ctrl: false }];
				const key = { ...createDefaultKey(), rightArrow: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches up arrow', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'up', ctrl: false }];
				const key = { ...createDefaultKey(), upArrow: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches down arrow', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'down', ctrl: false }];
				const key = { ...createDefaultKey(), downArrow: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches enter', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'enter', ctrl: false }];
				const key = { ...createDefaultKey(), return: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches escape', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'esc', ctrl: false }];
				const key = { ...createDefaultKey(), escape: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches tab', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'tab', ctrl: false }];
				const key = { ...createDefaultKey(), tab: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches backspace', () => {
				const bindings: KeyBinding[] = [
					{ specialKey: 'backspace', ctrl: false },
				];
				const key = { ...createDefaultKey(), backspace: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches delete', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'delete', ctrl: false }];
				const key = { ...createDefaultKey(), delete: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches pageup', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'pageup', ctrl: false }];
				const key = { ...createDefaultKey(), pageUp: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches pagedown', () => {
				const bindings: KeyBinding[] = [
					{ specialKey: 'pagedown', ctrl: false },
				];
				const key = { ...createDefaultKey(), pageDown: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches ctrl special key', () => {
				// When specialKey is 'ctrl', it checks key.ctrl
				// But we also need ctrl: undefined or not specified to avoid the modifier check
				const bindings: KeyBinding[] = [{ specialKey: 'ctrl' }];
				const key = { ...createDefaultKey(), ctrl: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('matches shift special key', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'shift', ctrl: false }];
				const key = { ...createDefaultKey(), shift: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(true);
			});

			it('does not match wrong arrow key', () => {
				const bindings: KeyBinding[] = [{ specialKey: 'left', ctrl: false }];
				const key = { ...createDefaultKey(), rightArrow: true };
				const result = isKeyMatch(key, '', bindings);
				expect(result).toBe(false);
			});
		});

		describe('modifier matching', () => {
			it('matches with ctrl modifier', () => {
				const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
				const key = { ...createDefaultKey(), ctrl: true };
				const result = isKeyMatch(key, 'c', bindings);
				expect(result).toBe(true);
			});

			it('does not match if ctrl required but not pressed', () => {
				const bindings: KeyBinding[] = [{ textKey: 'c', ctrl: true }];
				const result = isKeyMatch(createDefaultKey(), 'c', bindings);
				expect(result).toBe(false);
			});

			it('matches with shift modifier', () => {
				const bindings: KeyBinding[] = [{ textKey: 'G', shift: true }];
				const key = { ...createDefaultKey(), shift: true };
				const result = isKeyMatch(key, 'G', bindings);
				expect(result).toBe(true);
			});

			it('does not match if shift required but not pressed', () => {
				const bindings: KeyBinding[] = [{ textKey: 'G', shift: true }];
				const result = isKeyMatch(createDefaultKey(), 'G', bindings);
				expect(result).toBe(false);
			});

			it('matches with meta modifier', () => {
				const bindings: KeyBinding[] = [{ textKey: 'q', meta: true }];
				const key = { ...createDefaultKey(), meta: true };
				const result = isKeyMatch(key, 'q', bindings);
				expect(result).toBe(true);
			});

			it('does not match if meta required but not pressed', () => {
				const bindings: KeyBinding[] = [{ textKey: 'q', meta: true }];
				const result = isKeyMatch(createDefaultKey(), 'q', bindings);
				expect(result).toBe(false);
			});
		});

		describe('multiple bindings', () => {
			it('matches if any binding matches', () => {
				const bindings: KeyBinding[] = [
					{ textKey: 'q', ctrl: false },
					{ textKey: 'x', ctrl: false },
				];
				const result = isKeyMatch(createDefaultKey(), 'x', bindings);
				expect(result).toBe(true);
			});

			it('does not match if no binding matches', () => {
				const bindings: KeyBinding[] = [
					{ textKey: 'q', ctrl: false },
					{ textKey: 'x', ctrl: false },
				];
				const result = isKeyMatch(createDefaultKey(), 'z', bindings);
				expect(result).toBe(false);
			});
		});

		describe('empty bindings', () => {
			it('returns false for empty bindings array', () => {
				const result = isKeyMatch(createDefaultKey(), 'q', []);
				expect(result).toBe(false);
			});
		});
	});

	describe('getDisplayKey', () => {
		it('returns text key as-is', () => {
			const bindings: KeyBinding[] = [{ textKey: 'q', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('q');
		});

		it('returns arrow symbols for arrow keys', () => {
			expect(getDisplayKey([{ specialKey: 'left', ctrl: false }])).toBe('←');
			expect(getDisplayKey([{ specialKey: 'right', ctrl: false }])).toBe('→');
			expect(getDisplayKey([{ specialKey: 'up', ctrl: false }])).toBe('↑');
			expect(getDisplayKey([{ specialKey: 'down', ctrl: false }])).toBe('↓');
		});

		it('returns ESC for escape key', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'esc', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('ESC');
		});

		it('returns Enter for enter key', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'enter', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('Enter');
		});

		it('returns Tab for tab key', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'tab', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('Tab');
		});

		it('returns backspace symbol', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'backspace', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('⌫');
		});

		it('returns Del for delete key', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'delete', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('Del');
		});

		it('returns PgUp for pageup', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'pageup', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('PgUp');
		});

		it('returns PgDn for pagedown', () => {
			const bindings: KeyBinding[] = [{ specialKey: 'pagedown', ctrl: false }];
			expect(getDisplayKey(bindings)).toBe('PgDn');
		});

		it('joins multiple bindings with separator', () => {
			const bindings: KeyBinding[] = [
				{ textKey: 'j', ctrl: false },
				{ specialKey: 'down', ctrl: false },
			];
			expect(getDisplayKey(bindings)).toBe('j / ↓');
		});

		it('returns special key name for unknown special key', () => {
			const bindings: KeyBinding[] = [
				{ specialKey: 'unknown' as KeyBinding['specialKey'], ctrl: false },
			];
			expect(getDisplayKey(bindings)).toBe('unknown');
		});

		it('returns empty string for empty bindings', () => {
			expect(getDisplayKey([])).toBe('');
		});
	});
});
