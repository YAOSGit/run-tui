import { useCallback, useEffect, useRef, useState } from 'react';
import type { LogType } from '../../types/LogType/index.js';

// Log filter cycle: null -> stdout -> stderr -> null
const LOG_FILTERS: (LogType | null)[] = [null, 'stdout', 'stderr'];

export interface UseViewStateOptions {
	viewHeight: number;
	tasks: string[];
	getLogCountForTask: (taskName: string, filter: LogType | null) => number;
	markStderrSeen: (taskName: string) => void;
}

export const useViewState = ({
	viewHeight,
	tasks,
	getLogCountForTask,
	markStderrSeen,
}: UseViewStateOptions) => {
	const [activeTabIndex, setActiveTabIndexState] = useState(0);
	const [logFilter, setLogFilter] = useState<LogType | null>(null);
	const [scrollOffset, setScrollOffset] = useState(0);
	const [autoScroll, setAutoScroll] = useState(true);

	// Derived: active task from tasks array
	const activeTask = tasks[activeTabIndex];

	// Get total logs for current task (for scroll bounds)
	const totalLogs = activeTask ? getLogCountForTask(activeTask, logFilter) : 0;

	// Track previous log count to adjust scroll offset when new logs arrive
	const prevTotalLogsRef = useRef(totalLogs);

	// Reset scroll and re-enable autoScroll when switching tabs or filters
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset when tab/filter changes
	useEffect(() => {
		setScrollOffset(0);
		setAutoScroll(true);
		prevTotalLogsRef.current = 0;
	}, [activeTabIndex, logFilter]);

	// When autoScroll is disabled, adjust scrollOffset to keep view stable as new logs arrive
	useEffect(() => {
		if (!autoScroll && totalLogs > prevTotalLogsRef.current) {
			const newLogs = totalLogs - prevTotalLogsRef.current;
			setScrollOffset((prev: number) => prev + newLogs);
		}
		prevTotalLogsRef.current = totalLogs;
	}, [totalLogs, autoScroll]);

	// Navigate to the left tab (with wrap)
	const navigateLeft = useCallback(() => {
		setActiveTabIndexState((prev) => {
			const newIndex = prev === 0 ? tasks.length - 1 : prev - 1;
			// Mark stderr seen for the new tab
			if (tasks[newIndex]) {
				markStderrSeen(tasks[newIndex]);
			}
			return newIndex;
		});
	}, [tasks, markStderrSeen]);

	// Navigate to the right tab (with wrap)
	const navigateRight = useCallback(() => {
		setActiveTabIndexState((prev) => {
			const newIndex = prev === tasks.length - 1 ? 0 : prev + 1;
			// Mark stderr seen for the new tab
			if (tasks[newIndex]) {
				markStderrSeen(tasks[newIndex]);
			}
			return newIndex;
		});
	}, [tasks, markStderrSeen]);

	// Set active tab index directly
	const setActiveTabIndex = useCallback(
		(index: number) => {
			setActiveTabIndexState(index);
			if (tasks[index]) {
				markStderrSeen(tasks[index]);
			}
		},
		[tasks, markStderrSeen],
	);

	// Cycle through log filters
	const cycleLogFilter = useCallback(() => {
		setLogFilter((prev) => {
			const currentIndex = LOG_FILTERS.indexOf(prev);
			const nextIndex = (currentIndex + 1) % LOG_FILTERS.length;
			return LOG_FILTERS[nextIndex];
		});
	}, []);

	// Scroll up (away from bottom)
	const scrollUp = useCallback(() => {
		setScrollOffset((prev: number) =>
			Math.min(prev + 1, Math.max(0, totalLogs - viewHeight)),
		);
		setAutoScroll(false);
	}, [totalLogs, viewHeight]);

	// Scroll down (toward bottom)
	const scrollDown = useCallback(() => {
		setScrollOffset((prev: number) => {
			const newOffset = Math.max(0, prev - 1);
			if (newOffset === 0) {
				setAutoScroll(true);
			}
			return newOffset;
		});
	}, []);

	// Scroll to bottom and re-enable auto-scroll
	const scrollToBottom = useCallback(() => {
		setScrollOffset(0);
		setAutoScroll(true);
	}, []);

	// Adjust active tab index if tasks are removed
	useEffect(() => {
		if (tasks.length === 0) {
			setActiveTabIndexState(0);
		} else if (activeTabIndex >= tasks.length) {
			setActiveTabIndexState(Math.max(0, tasks.length - 1));
		}
	}, [tasks.length, activeTabIndex]);

	return {
		activeTabIndex,
		activeTask,
		logFilter,
		scrollOffset,
		autoScroll,
		viewHeight,
		totalLogs,
		navigateLeft,
		navigateRight,
		setActiveTabIndex,
		cycleLogFilter,
		scrollUp,
		scrollDown,
		scrollToBottom,
	};
};
