import type { Key } from 'ink';
import type { KeyBinding } from '../../types/KeyBinding/index.js';

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
