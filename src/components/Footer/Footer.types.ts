import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import type { LogType } from '../../types/LogType/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';

export interface FooterProps {
	commands: VisibleCommand[];
	activeTask: string | undefined;
	status: TaskStatus | undefined;
	logFilter: LogType | null;
}
