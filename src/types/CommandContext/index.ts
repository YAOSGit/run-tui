import type { LogType } from '../LogType/index.js';
import type { TaskStatus } from '../TaskStatus/index.js';

export interface CommandContext {
	// State
	activeTask: string | undefined;
	taskStatus: TaskStatus | undefined;
	runningTasks: string[];
	hasRunningTasks: boolean;
	keepAlive: boolean;
	showScriptSelector: boolean;
	logFilter: LogType | null;

	// Actions
	killProcess: (task: string) => void;
	spawnTask: (task: string) => void;
	handleQuit: () => void;
	setShowScriptSelector: (show: boolean) => void;
	setLogFilter: React.Dispatch<React.SetStateAction<LogType | null>>;
	removeTask: (task: string) => void;
	setRunningTasks: React.Dispatch<React.SetStateAction<string[]>>;
	setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
	markStderrSeen: (task: string) => void;
}
