import type { LineOverflow } from '../../types/LineOverflow/index.js';
import type { LogEntry } from '../../types/LogEntry/index.js';

export type LogViewProps = {
	logs: LogEntry[];
	width?: number;
	isRunning?: boolean;
	lineOverflow?: LineOverflow;
	showTimestamps?: boolean;
	searchQuery?: string;
};
