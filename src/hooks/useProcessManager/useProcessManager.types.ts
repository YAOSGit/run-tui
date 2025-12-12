import type { LogEntry } from '../../types/LogEntry/index.js';
import type { PackageManager } from '../../types/PackageManager/index.js';
import type { TaskState } from '../../types/TaskState/index.js';

export interface UseProcessManagerOptions {
	tasks: string[];
	packageManager: PackageManager;
	onLogEntry: (entry: LogEntry) => void;
	onTaskStateChange: (taskName: string, state: Partial<TaskState>) => void;
}
