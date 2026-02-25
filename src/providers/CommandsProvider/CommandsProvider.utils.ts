import type { Key } from 'ink';
import type { KeyBinding } from '../../types/KeyBinding/index.js';
import { MOD_KEY } from '../../utils/platform/index.js';

export const isKeyMatch = (
	key: Key,
	input: string,
	bindings: KeyBinding[],
): boolean => {
	return bindings.some((binding) => {
		if (binding.shift !== undefined && key.shift !== binding.shift)
			return false;
		if (binding.meta !== undefined && key.meta !== binding.meta) return false;
		if (binding.ctrl !== undefined && key.ctrl !== binding.ctrl) return false;
		if (binding.leftArrow !== undefined && key.leftArrow !== binding.leftArrow)
			return false;
		if (
			binding.rightArrow !== undefined &&
			key.rightArrow !== binding.rightArrow
		)
			return false;

		if (binding.textKey) {
			return binding.textKey.toLocaleLowerCase() === input.toLocaleLowerCase();
		}

		if (binding.specialKey) {
			switch (binding.specialKey) {
				case 'left':
					return key.leftArrow;
				case 'right':
					return key.rightArrow;
				case 'up':
					return key.upArrow;
				case 'down':
					return key.downArrow;
				case 'pageup':
					return key.pageUp;
				case 'pagedown':
					return key.pageDown;
				case 'backspace':
					return key.backspace;
				case 'delete':
					return key.delete;
				case 'enter':
					return key.return;
				case 'tab':
					return key.tab;
				case 'esc':
					return key.escape;
				case 'ctrl':
					return key.ctrl;
				case 'shift':
					return key.shift;
				default:
					return false;
			}
		}

		return false;
	});
};

const SPECIAL_KEY_DISPLAY: Record<string, string> = {
	left: '←',
	right: '→',
	up: '↑',
	down: '↓',
	esc: 'ESC',
	enter: 'Enter',
	tab: 'Tab',
	backspace: '⌫',
	delete: 'Del',
	pageup: 'PgUp',
	pagedown: 'PgDn',
};

export const getDisplayKey = (keys: KeyBinding[]): string => {
	return keys
		.map((binding) => {
			let prefix = '';
			if (binding.ctrl) prefix += 'ctrl + ';
			if (binding.meta) prefix += `${MOD_KEY}\xA0+\xA0`;
			// Only show shift+ if it's a visible text key or an explicit special key,
			// since shift is technically already implied by capitalized ascii (e.g. 'N' instead of 'shift+N')
			// but for clarity we'll show it for special commands when requested
			if (binding.shift && (binding.specialKey || binding.textKey)) {
				prefix += 'shift + ';
			}

			if (binding.textKey) {
				return prefix + binding.textKey;
			}
			if (binding.specialKey) {
				const keyName =
					SPECIAL_KEY_DISPLAY[binding.specialKey] ?? binding.specialKey;
				return prefix + keyName;
			}
			return '';
		})
		.filter(Boolean)
		.join(' / ');
};
