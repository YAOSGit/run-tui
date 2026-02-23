import type { TaskStatus } from '../TaskStatus/index.js';

export type TaskState = {
	name: string;
	status: TaskStatus;
	exitCode: number | null;
	hasUnseenStderr: boolean;
	restartCount: number;
	startedAt: number | null;
	endedAt: number | null;
};
