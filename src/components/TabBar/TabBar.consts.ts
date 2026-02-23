import type { Color } from '../../types/Color/index.js';
import { COLOR } from '../../types/Color/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

export const TAB_BAR_STATUS_COLORS: Record<TaskStatus, Color> = {
	[TASK_STATUS.PENDING]: COLOR.GRAY,
	[TASK_STATUS.RUNNING]: COLOR.BLUE,
	[TASK_STATUS.SUCCESS]: COLOR.GREEN,
	[TASK_STATUS.ERROR]: COLOR.RED,
	[TASK_STATUS.RESTARTING]: COLOR.YELLOW,
} as const;

export const TAB_BAR_INDEX_COLORS: Color[] = [
	COLOR.CYAN,
	COLOR.MAGENTA,
	COLOR.YELLOW,
	COLOR.BLUE,
	COLOR.GREEN,
	COLOR.RED,
	COLOR.GRAY,
] as const;
