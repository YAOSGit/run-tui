import type { CommandContext } from '../CommandContext/index.js';
import type { KeyBinding } from '../KeyBinding/index.js';

export interface Command {
	id: string;
	keys: KeyBinding[];
	displayKey?: string; // Optional - will be calculated from keys if not provided
	displayText: string;
	isEnabled: (ctx: CommandContext) => boolean;
	execute: (ctx: CommandContext) => void;
	needsConfirmation?: (ctx: CommandContext) => boolean;
	confirmMessage?: string | ((ctx: CommandContext) => string);
}

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
			if (binding.textKey) {
				return binding.textKey;
			}
			if (binding.specialKey) {
				return SPECIAL_KEY_DISPLAY[binding.specialKey] ?? binding.specialKey;
			}
			return '';
		})
		.filter(Boolean)
		.join(' / ');
};
