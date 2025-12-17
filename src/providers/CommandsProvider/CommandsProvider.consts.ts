import type { KeyBinding } from '../../types/KeyBinding/index.js';

export const CONFIRM_YES_KEYS: KeyBinding[] = [
	{ textKey: 'y', ctrl: false },
	{ specialKey: 'enter', ctrl: false },
];

export const CONFIRM_NO_KEYS: KeyBinding[] = [
	{ textKey: 'n', ctrl: false },
	{ specialKey: 'esc', ctrl: false },
];
