import type { Key } from 'ink';
import type { KeyCommand } from './App.types.js';

export const isKeyCommand = (
	key: Key,
	input: string,
	command: KeyCommand[],
): boolean => {
	return command.some((cmd) => {
		if (cmd.shift !== undefined && key.shift !== cmd.shift) return false;
		if (cmd.meta !== undefined && key.meta !== cmd.meta) return false;
		if (cmd.ctrl !== undefined && key.ctrl !== cmd.ctrl) return false;

		if (cmd.textKey)
			return cmd.textKey.toLocaleLowerCase() === input.toLocaleLowerCase();

		if (cmd.specialKey) {
			switch (cmd.specialKey) {
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
