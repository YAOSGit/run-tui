import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';

export interface UseViewStateOptions {
	viewHeight: number;
	tasks: string[];
	pinnedTasks: string[];
	getLogCountForTask: (taskName: string, filter: LogType | null) => number;
	getLogsForTask: (taskName: string, filter: LogType | null) => LogEntry[];
	markStderrSeen: (taskName: string) => void;
}
