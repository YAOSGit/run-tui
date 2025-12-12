export const TASK_STATUS = {
	PENDING: 'pending',
	RUNNING: 'running',
	SUCCESS: 'success',
	ERROR: 'error',
} as const;
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
