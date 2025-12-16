import type { LogType } from '../../types/LogType/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';

export interface ScrollInfo {
	startLine: number;
	endLine: number;
	totalLogs: number;
	autoScroll: boolean;
}

export interface FooterProps {
	commands: VisibleCommand[];
	activeTask: string | undefined;
	status: TaskStatus | undefined;
	logFilter: LogType | null;
	scrollInfo?: ScrollInfo;
}
