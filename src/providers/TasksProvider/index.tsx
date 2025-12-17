import type React from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useProcessManager } from '../../hooks/useProcessManager/index.js';
import { useTasksState } from '../../hooks/useTasksState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import type {
	TasksContextValue,
	TasksProviderProps,
} from './TasksProvider.types.js';

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider: React.FC<TasksProviderProps> = ({
	children,
	initialTasks,
	packageManager,
	onLogEntry,
}) => {
	const {
		tasks,
		taskStates,
		hasRunningTasks,
		updateTaskState,
		addTaskState,
		removeTaskState,
		markStderrSeen,
		getTaskStatus,
	} = useTasksState(initialTasks);

	const { spawnProcess, killProcess, killAllProcesses } = useProcessManager({
		initialTasks,
		packageManager,
		onLogEntry,
		onTaskStateChange: updateTaskState,
	});

	// Public: Add and spawn a new task
	const addTask = useCallback(
		(taskName: string) => {
			addTaskState(taskName);
			spawnProcess(taskName);
		},
		[addTaskState, spawnProcess],
	);

	// Public: Close/remove a task (only when completed)
	const closeTask = useCallback(
		(taskName: string) => {
			removeTaskState(taskName);
		},
		[removeTaskState],
	);

	// Public: Restart a completed task
	const restartTask = useCallback(
		(taskName: string) => {
			updateTaskState(taskName, {
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			});
			spawnProcess(taskName);
		},
		[updateTaskState, spawnProcess],
	);

	// Public: Kill a running task
	const killTask = useCallback(
		(taskName: string) => {
			killProcess(taskName, true);
		},
		[killProcess],
	);

	// Public: Kill all tasks (for quit)
	const killAllTasks = useCallback(() => {
		killAllProcesses();
	}, [killAllProcesses]);

	const value: TasksContextValue = useMemo(
		() => ({
			tasks,
			taskStates,
			hasRunningTasks,
			addTask,
			closeTask,
			restartTask,
			killTask,
			killAllTasks,
			markStderrSeen,
			getTaskStatus,
		}),
		[
			tasks,
			taskStates,
			hasRunningTasks,
			addTask,
			closeTask,
			restartTask,
			killTask,
			killAllTasks,
			markStderrSeen,
			getTaskStatus,
		],
	);

	return (
		<TasksContext.Provider value={value}>{children}</TasksContext.Provider>
	);
};

export const useTasks = (): TasksContextValue => {
	const context = useContext(TasksContext);
	if (!context) {
		throw new Error('useTasks must be used within a TasksProvider');
	}
	return context;
};
