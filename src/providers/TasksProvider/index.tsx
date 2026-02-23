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
	restartConfig,
	scriptArgs,
	onLogEntry,
}) => {
	const {
		tasks,
		pinnedTasks,
		tabAliases,
		taskStates,
		hasRunningTasks,
		updateTaskState,
		addTaskState,
		removeTaskState,
		markStderrSeen,
		toggleTaskPin,
		renameTask,
		getTaskStatus,
		moveTaskLeft,
		moveTaskRight,
	} = useTasksState(initialTasks);

	const {
		spawnProcess,
		killProcess,
		killAllProcesses,
		clearRestartTimer,
		resetRestartCount,
	} = useProcessManager({
		initialTasks,
		packageManager,
		restartConfig,
		scriptArgs,
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

	// Public: Restart a completed or restarting task
	const restartTask = useCallback(
		(taskName: string) => {
			clearRestartTimer(taskName);
			resetRestartCount(taskName);
			updateTaskState(taskName, {
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
				restartCount: 0,
				startedAt: null,
				endedAt: null,
			});
			spawnProcess(taskName);
		},
		[updateTaskState, spawnProcess, clearRestartTimer, resetRestartCount],
	);

	// Public: Kill a running task
	const killTask = useCallback(
		(taskName: string) => {
			killProcess(taskName, true);
		},
		[killProcess],
	);

	// Public: Cancel a pending restart
	const cancelRestart = useCallback(
		(taskName: string) => {
			clearRestartTimer(taskName);
			resetRestartCount(taskName);
			updateTaskState(taskName, {
				status: TASK_STATUS.ERROR,
			});
		},
		[clearRestartTimer, resetRestartCount, updateTaskState],
	);

	// Public: Kill all tasks (for quit)
	const killAllTasks = useCallback(() => {
		killAllProcesses();
	}, [killAllProcesses]);

	const value: TasksContextValue = useMemo(
		() => ({
			tasks,
			pinnedTasks,
			tabAliases,
			taskStates,
			hasRunningTasks,
			addTask,
			closeTask,
			restartTask,
			killTask,
			killAllTasks,
			cancelRestart,
			markStderrSeen,
			toggleTaskPin,
			renameTask,
			getTaskStatus,
			moveTaskLeft,
			moveTaskRight,
		}),
		[
			tasks,
			pinnedTasks,
			tabAliases,
			taskStates,
			hasRunningTasks,
			addTask,
			closeTask,
			restartTask,
			killTask,
			killAllTasks,
			cancelRestart,
			markStderrSeen,
			toggleTaskPin,
			renameTask,
			getTaskStatus,
			moveTaskLeft,
			moveTaskRight,
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
