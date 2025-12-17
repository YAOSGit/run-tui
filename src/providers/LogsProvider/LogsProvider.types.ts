import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';

export interface LogsProviderProps {
	children: React.ReactNode;
}

export interface LogsContextValue {
	addLog: (entry: LogEntry) => void;
	getLogsForTask: (
		taskName: string,
		filter: LogType | null,
		limit?: number,
		scrollOffset?: number,
	) => LogEntry[];
	getLogCountForTask: (taskName: string, filter: LogType | null) => number;
	clearLogsForTask: (taskName: string) => void;
}
