import type { LogEntry } from '../../types/LogEntry/index.js';

export interface LogViewProps {
	logs: LogEntry[];
	height?: number;
	width?: number;
	isRunning?: boolean;
}
