import type { TaskState } from '../../types/TaskState/index.js';

export interface TabBarProps {
	tasks: string[];
	taskStates: Record<string, TaskState>;
	activeTabIndex: number;
}
