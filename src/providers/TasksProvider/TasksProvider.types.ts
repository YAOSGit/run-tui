import type { PackageManager } from '../../types/PackageManager/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';

export interface TasksProviderProps {
	children: React.ReactNode;
	initialTasks: string[];
	packageManager: PackageManager;
	onLogEntry: (entry: import('../../types/LogEntry/index.js').LogEntry) => void;
}

export interface TasksContextValue {
	// State
	tasks: string[];
	taskStates: Record<string, TaskState>;
	hasRunningTasks: boolean;

	// High-level Actions
	addTask: (taskName: string) => void;
	closeTask: (taskName: string) => void;
	restartTask: (taskName: string) => void;
	killTask: (taskName: string) => void;
	killAllTasks: () => void;
	markStderrSeen: (taskName: string) => void;

	// Query
	getTaskStatus: (taskName: string) => TaskStatus | undefined;
}
