import type { LogType } from '../../types/LogType/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';

export interface FooterProps {
	activeTask: string;
	status: TaskStatus;
	logFilter: LogType | null;
}
