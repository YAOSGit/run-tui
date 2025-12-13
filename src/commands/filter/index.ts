import type { Command } from '../../types/Command/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';

const LOG_FILTERS: (LogType | null)[] = [
	null,
	LOG_TYPE.STDOUT,
	LOG_TYPE.STDERR,
];

export const filterCommand: Command = {
	id: 'FILTER',
	keys: [{ textKey: 'f', ctrl: false }],
	displayText: 'filter',
	isEnabled: (ctx) => !ctx.showScriptSelector && ctx.runningTasks.length > 0,
	execute: (ctx) => {
		ctx.setLogFilter((prev) => {
			const currentIndex = LOG_FILTERS.indexOf(prev);
			return LOG_FILTERS[(currentIndex + 1) % LOG_FILTERS.length];
		});
	},
};
