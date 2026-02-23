import type { LineOverflow } from '../../types/LineOverflow/index.js';
import type { LogEntry } from '../../types/LogEntry/index.js';

export interface LogViewProps {
	logs: LogEntry[];
	height?: number;
	width?: number;
	isRunning?: boolean;
	lineOverflow?: LineOverflow;
	showTimestamps?: boolean;
	searchQuery?: string;
}
