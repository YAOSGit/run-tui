import type { KeyBinding } from '../KeyBinding/index.js';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';

export interface Command {
	id: string;
	keys: KeyBinding[];
	displayKey?: string;
	displayText: string;
	isEnabled: (p: CommandProviders) => boolean;
	execute: (p: CommandProviders) => void;
	needsConfirmation?: (p: CommandProviders) => boolean;
	confirmMessage?: string | ((p: CommandProviders) => string);
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
