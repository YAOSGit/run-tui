import type { LogEntry } from '../../types/LogEntry/index.js';
import type { PackageManager } from '../../types/PackageManager/index.js';
import type { RestartConfig } from '../../types/RestartConfig/index.js';
import type { TaskState } from '../../types/TaskState/index.js';

export interface UseProcessManagerOptions {
	initialTasks: string[];
	packageManager: PackageManager;
	restartConfig: RestartConfig;
	scriptArgs: string[];
	onLogEntry: (entry: LogEntry) => void;
	onTaskStateChange: (taskName: string, updates: Partial<TaskState>) => void;
}
