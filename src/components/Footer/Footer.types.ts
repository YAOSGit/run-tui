import type { LogType } from '../../types/LogType/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';

export type ScrollInfo = {
	startLine: number;
	endLine: number;
	totalLogs: number;
	autoScroll: boolean;
};

export type FooterProps = {
	commands: VisibleCommand[];
	activeTask: string | undefined;
	status: TaskStatus | undefined;
	logFilter: LogType | null;
	scrollInfo?: ScrollInfo;
	width?: number;
	confirmation?: { message: string } | null;
};
