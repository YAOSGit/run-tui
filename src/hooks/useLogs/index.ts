import { useCallback, useState } from 'react';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { MAX_LOGS } from './useLogs.consts.js';

export const useLogs = () => {
	const [logs, setLogs] = useState<LogEntry[]>([]);

	const addLog = useCallback((entry: LogEntry) => {
		setLogs((prev) => {
			const next = [...prev, entry];
			if (next.length > MAX_LOGS) {
				return next.slice(next.length - MAX_LOGS);
			}
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
			let taskLogs = logs.filter((l) => l.task === taskName);
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
		[logs],
	);

	const getLogCountForTask = useCallback(
		(taskName: string, filter: LogType | null = null) => {
			let taskLogs = logs.filter((l) => l.task === taskName);
			if (filter !== null) {
				taskLogs = taskLogs.filter((l) => l.type === filter);
			}
			return taskLogs.length;
		},
		[logs],
	);

	const clearLogsForTask = useCallback((taskName: string) => {
		setLogs((prev) => prev.filter((l) => l.task !== taskName));
	}, []);

	return {
		addLog,
		getLogsForTask,
		getLogCountForTask,
		clearLogsForTask,
	};
};
