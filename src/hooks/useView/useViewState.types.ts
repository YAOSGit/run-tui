import type { LogType } from '../../types/LogType/index.js';

export interface UseViewStateOptions {
	viewHeight: number;
	tasks: string[];
	getLogCountForTask: (taskName: string, filter: LogType | null) => number;
	markStderrSeen: (taskName: string) => void;
}
