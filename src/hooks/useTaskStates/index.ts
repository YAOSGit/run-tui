import { useCallback, useState } from 'react';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

export const useTaskStates = (initialTasks: string[]) => {
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

	const updateTaskState = useCallback(
		(taskName: string, updates: Partial<TaskState>) => {
			setTaskStates((prev) => ({
				...prev,
				[taskName]: { ...prev[taskName], ...updates },
			}));
		},
		[],
	);

	const markStderrSeen = useCallback((taskName: string) => {
		setTaskStates((prev) => ({
			...prev,
			[taskName]: { ...prev[taskName], hasUnseenStderr: false },
		}));
	}, []);

	const addTask = useCallback((taskName: string) => {
		setTaskStates((prev) => ({
			...prev,
			[taskName]: {
				name: taskName,
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			},
		}));
	}, []);

	const removeTask = useCallback((taskName: string) => {
		setTaskStates((prev) => {
			const { [taskName]: _, ...rest } = prev;
			return rest;
		});
	}, []);

	return {
		taskStates,
		updateTaskState,
		markStderrSeen,
		addTask,
		removeTask,
	};
};
