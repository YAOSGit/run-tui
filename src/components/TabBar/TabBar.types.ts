import type { TaskState } from '../../types/TaskState/index.js';

export interface TabBarProps {
	tasks: string[];
	taskStates: Record<string, TaskState>;
	pinnedTasks: string[];
	tabAliases: Record<string, string>;
	activeTabIndex: number;
	width?: number;
}
