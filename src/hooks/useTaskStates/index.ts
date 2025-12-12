import { useCallback, useState } from 'react';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

export const useTaskStates = (tasks: string[]) => {
	const [taskStates, setTaskStates] = useState<Record<string, TaskState>>(
		() => {
			const initial: Record<string, TaskState> = {};
			tasks.forEach((t) => {
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

	return {
		taskStates,
		updateTaskState,
		markStderrSeen,
	};
};
