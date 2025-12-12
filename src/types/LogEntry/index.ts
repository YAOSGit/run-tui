import type { LogType } from '../LogType/index.js';

export type LogEntry = {
	id: string;
	task: string;
	text: string;
	type: LogType;
	timestamp: string;
};
