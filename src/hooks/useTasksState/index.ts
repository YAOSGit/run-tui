import { useCallback, useMemo, useState } from 'react';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

export const useTasksState = (initialTasks: string[]) => {
	// Task list state
	const [baseTasks, setBaseTasks] = useState<string[]>(initialTasks);
	const [pinnedTasks, setPinnedTasks] = useState<string[]>([]);
	const [tabAliases, setTabAliases] = useState<Record<string, string>>({});

	// Computed tasks array: pinned tasks first, then unpinned
	const tasks = useMemo(() => {
		const pinned = baseTasks.filter((t) => pinnedTasks.includes(t));
		const unpinned = baseTasks.filter((t) => !pinnedTasks.includes(t));
		return [...pinned, ...unpinned];
	}, [baseTasks, pinnedTasks]);

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
					restartCount: 0,
					startedAt: null,
					endedAt: null,
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
	const addTaskState = useCallback(
		(taskName: string): string => {
			setTaskStates((prev) => {
				let finalTaskName = taskName;
				let counter = 2;
				while (finalTaskName in prev) {
					finalTaskName = `${taskName} (${counter})`;
					counter++;
				}

				const next = {
					...prev,
					[finalTaskName]: {
						name: finalTaskName,
						status: TASK_STATUS.PENDING,
						exitCode: null,
						hasUnseenStderr: false,
						restartCount: 0,
						startedAt: null,
						endedAt: null,
					},
				};

				// We need to update baseTasks inside the setState callback to ensure sync if used directly,
				// but React state batching ensures the external setBaseTasks call below works.
				return next;
			});

			// Compute the exact finalTaskName identically here so we can update baseTasks synchronously
			setBaseTasks((prev) => {
				let finalTaskName = taskName;
				let counter = 2;
				while (prev.includes(finalTaskName)) {
					finalTaskName = `${taskName} (${counter})`;
					counter++;
				}
				return [...prev, finalTaskName];
			});

			// Calculate the returned name string one more time outside setters for consumer use (like spawning)
			let nameToReturn = taskName;
			let counterReturn = 2;
			while (
				baseTasks.includes(nameToReturn) ||
				taskStates[nameToReturn] !== undefined
			) {
				nameToReturn = `${taskName} (${counterReturn})`;
				counterReturn++;
			}
			return nameToReturn;
		},
		[baseTasks, taskStates],
	);

	// Remove a task from the state
	const removeTaskState = useCallback((taskName: string) => {
		setTaskStates((prev) => {
			const { [taskName]: _, ...rest } = prev;
			return rest;
		});
		setBaseTasks((prev) => prev.filter((t) => t !== taskName));
		setPinnedTasks((prev) => prev.filter((t) => t !== taskName));
	}, []);

	// Mark stderr as seen for a task
	const markStderrSeen = useCallback((taskName: string) => {
		setTaskStates((prev) => ({
			...prev,
			[taskName]: { ...prev[taskName], hasUnseenStderr: false },
		}));
	}, []);

	// Toggle pinned status
	const toggleTaskPin = useCallback((taskName: string) => {
		setPinnedTasks((prev) => {
			if (prev.includes(taskName)) {
				return [];
			}
			return [taskName];
		});
	}, []);

	// Rename task (UI mapping only)
	const renameTask = useCallback((taskName: string, newName: string) => {
		setTabAliases((prev) => ({
			...prev,
			[taskName]: newName,
		}));
	}, []);

	// Move task left
	const moveTaskLeft = useCallback((taskName: string) => {
		setBaseTasks((prev) => {
			const index = prev.indexOf(taskName);
			if (index <= 0) return prev;
			const newTasks = [...prev];
			const temp = newTasks[index];
			if (temp !== undefined && newTasks[index - 1] !== undefined) {
				newTasks[index] = newTasks[index - 1] as string;
				newTasks[index - 1] = temp;
			}
			return newTasks;
		});
	}, []);

	// Move task right
	const moveTaskRight = useCallback((taskName: string) => {
		setBaseTasks((prev) => {
			const index = prev.indexOf(taskName);
			if (index < 0 || index >= prev.length - 1) return prev;
			const newTasks = [...prev];
			const temp = newTasks[index];
			if (temp !== undefined && newTasks[index + 1] !== undefined) {
				newTasks[index] = newTasks[index + 1] as string;
				newTasks[index + 1] = temp;
			}
			return newTasks;
		});
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
	};
};
