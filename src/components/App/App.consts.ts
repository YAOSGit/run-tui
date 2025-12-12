import type { LogType } from '../../types/LogType/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import type { KeyCommand } from './App.types.js';

export const LOG_FILTERS: (LogType | null)[] = [
	null,
	LOG_TYPE.STDOUT,
	LOG_TYPE.STDERR,
] as const;
export const VISIBLE_LOGS = 20;

export const KEY_COMMANDS: Record<string, KeyCommand[]> = {
	QUIT: [
		{ textKey: 'q', ctrl: false },
		{ specialKey: 'esc', ctrl: false },
	],
	KILL: [{ textKey: 'k', ctrl: false }],
	CONFIRM_QUIT_YES: [
		{ textKey: 'y', ctrl: false },
		{ specialKey: 'enter', ctrl: false },
		{ specialKey: 'esc', ctrl: false },
		{ textKey: 'q', ctrl: false },
	],
	CONFIRM_QUIT_NO: [{ textKey: 'n', ctrl: false }],
	FILTER: [{ textKey: 'f', ctrl: false }],
	LEFT_ARROW: [{ specialKey: 'left' }],
	RIGHT_ARROW: [{ specialKey: 'right' }],
} as const;
