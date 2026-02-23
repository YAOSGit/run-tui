import type { PackageManager } from '../../types/PackageManager/index.js';
import type { RestartConfig } from '../../types/RestartConfig/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';

export interface TasksProviderProps {
	children: React.ReactNode;
	initialTasks: string[];
	packageManager: PackageManager;
	restartConfig: RestartConfig;
	scriptArgs: string[];
	onLogEntry: (entry: import('../../types/LogEntry/index.js').LogEntry) => void;
}

export interface TasksContextValue {
	// State
	tasks: string[];
	pinnedTasks: string[];
	tabAliases: Record<string, string>;
	taskStates: Record<string, TaskState>;
	hasRunningTasks: boolean;

	// High-level Actions
	addTask: (taskName: string) => void;
	closeTask: (taskName: string) => void;
	restartTask: (taskName: string) => void;
	killTask: (taskName: string) => void;
	killAllTasks: () => void;
	cancelRestart: (taskName: string) => void;
	markStderrSeen: (taskName: string) => void;
	toggleTaskPin: (taskName: string) => void;
	renameTask: (taskName: string, newName: string) => void;
	moveTaskLeft: (taskName: string) => void;
	moveTaskRight: (taskName: string) => void;

	// Query
	getTaskStatus: (taskName: string) => TaskStatus | undefined;
}
