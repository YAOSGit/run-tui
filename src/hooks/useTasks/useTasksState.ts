import { useCallback, useMemo, useState } from 'react';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

export const useTasksState = (initialTasks: string[]) => {
	// Task list state
	const [tasks, setTasks] = useState<string[]>(initialTasks);

	// Task states (status, exit code, stderr flag)
	const [taskStates, setTaskStates] = useState<Record<string, TaskState>>(
		() => {
			const initial: Record<string, TaskState> = {};
			initialTasks.forEach((t) => {
				initial[t] = {
					name: t,
					status: TASK_STATUS.PENDING,
					exitCode: null,
					hasUnseenStderr: false,
				};
			});
			return initial;
		},
	);

	// Update task state
	const updateTaskState = useCallback(
		(taskName: string, updates: Partial<TaskState>) => {
			setTaskStates((prev) => ({
				...prev,
				[taskName]: { ...prev[taskName], ...updates },
			}));
		},
		[],
	);

	// Add a new task to the state
	const addTaskState = useCallback((taskName: string) => {
		setTaskStates((prev) => ({
			...prev,
			[taskName]: {
				name: taskName,
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			},
		}));
		setTasks((prev) => [...prev, taskName]);
	}, []);

	// Remove a task from the state
	const removeTaskState = useCallback((taskName: string) => {
		setTaskStates((prev) => {
			const { [taskName]: _, ...rest } = prev;
			return rest;
		});
		setTasks((prev) => prev.filter((t) => t !== taskName));
	}, []);

	// Mark stderr as seen for a task
	const markStderrSeen = useCallback((taskName: string) => {
		setTaskStates((prev) => ({
			...prev,
			[taskName]: { ...prev[taskName], hasUnseenStderr: false },
		}));
	}, []);

	// Get task status
	const getTaskStatus = useCallback(
		(taskName: string) => {
			return taskStates[taskName]?.status;
		},
		[taskStates],
	);

	// Computed: has running tasks
	const hasRunningTasks = useMemo(
		() =>
			Object.values(taskStates).some((t) => t.status === TASK_STATUS.RUNNING),
		[taskStates],
	);

	return {
		tasks,
		taskStates,
		hasRunningTasks,
		updateTaskState,
		addTaskState,
		removeTaskState,
		markStderrSeen,
		getTaskStatus,
	};
};
