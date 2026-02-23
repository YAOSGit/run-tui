import { useCallback, useState } from 'react';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { MAX_LOGS_PER_TASK } from './useLogs.consts.js';

/**
 * Stores logs indexed by task name for O(1) task lookup.
 * Each task's logs are capped at MAX_LOGS_PER_TASK.
 */
export const useLogs = () => {
	const [logsByTask, setLogsByTask] = useState<Map<string, LogEntry[]>>(
		new Map(),
	);

	const addLog = useCallback((entry: LogEntry) => {
		setLogsByTask((prev) => {
			const next = new Map(prev);
			const taskLogs = next.get(entry.task) ?? [];
			const updated = [...taskLogs, entry];
			next.set(
				entry.task,
				updated.length > MAX_LOGS_PER_TASK
					? updated.slice(updated.length - MAX_LOGS_PER_TASK)
					: updated,
			);
			return next;
		});
	}, []);

	const getLogsForTask = useCallback(
		(
			taskName: string,
			filter: LogType | null = null,
			limit?: number,
			scrollOffset = 0,
		) => {
			let taskLogs = logsByTask.get(taskName) ?? [];
			if (filter !== null) {
				taskLogs = taskLogs.filter((l) => l.type === filter);
			}
			if (limit) {
				// scrollOffset is how many lines from the bottom we've scrolled up
				const endIndex = taskLogs.length - scrollOffset;
				const startIndex = Math.max(0, endIndex - limit);
				return taskLogs.slice(startIndex, endIndex);
			}
			return taskLogs;
		},
		[logsByTask],
	);

	const getLogCountForTask = useCallback(
		(taskName: string, filter: LogType | null = null) => {
			const taskLogs = logsByTask.get(taskName) ?? [];
			if (filter !== null) {
				return taskLogs.filter((l) => l.type === filter).length;
			}
			return taskLogs.length;
		},
		[logsByTask],
	);

	const clearLogsForTask = useCallback((taskName: string) => {
		setLogsByTask((prev) => {
			const next = new Map(prev);
			next.delete(taskName);
			return next;
		});
	}, []);

	return {
		addLog,
		getLogsForTask,
		getLogCountForTask,
		clearLogsForTask,
	};
};
