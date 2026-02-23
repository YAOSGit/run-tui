import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { LOG_FILTERS } from './useViewState.consts.js';
import type { UseViewStateOptions } from './useViewState.types.js';

export const useViewState = ({
	viewHeight,
	tasks,
	pinnedTasks,
	getLogCountForTask,
	getLogsForTask,
	markStderrSeen,
}: UseViewStateOptions) => {
	const [activeTaskName, setActiveTaskName] = useState<string | null>(
		tasks[0] ?? null,
	);
	const [logFilter, setLogFilter] = useState<LogType | null>(null);
	// Primary Pane
	const [primaryScrollOffset, setPrimaryScrollOffset] = useState(0);
	const [primaryAutoScroll, setPrimaryAutoScroll] = useState(true);

	// Split Pane
	const [activePane, setActivePane] = useState<'primary' | 'split'>('primary');
	const [splitScrollOffset, setSplitScrollOffset] = useState(0);
	const [splitAutoScroll, setSplitAutoScroll] = useState(true);
	const [showTimestamps, setShowTimestamps] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showRenameInput, setShowRenameInput] = useState(false);
	const [focusMode, setFocusMode] = useState(false);
	const [displayMode, setDisplayMode] = useState<'full' | 'compact'>('full');

	// Derived: tasks logic
	const activeTabIndex = useMemo(() => {
		if (!activeTaskName) return 0;
		const index = tasks.indexOf(activeTaskName);
		return index >= 0 ? index : 0;
	}, [tasks, activeTaskName]);

	const activeTask = tasks[activeTabIndex];
	const splitTaskName =
		pinnedTasks.length > 0 && pinnedTasks[0] !== activeTaskName
			? (pinnedTasks[0] ?? null)
			: null;
	const splitTask =
		splitTaskName && tasks.includes(splitTaskName) ? splitTaskName : null;

	// Calculate log counts for both panes
	const primaryLogs = activeTask
		? getLogCountForTask(activeTask, logFilter)
		: 0;
	const splitLogs = splitTask ? getLogCountForTask(splitTask, logFilter) : 0;

	const totalLogs = activePane === 'primary' ? primaryLogs : splitLogs;

	const prevPrimaryLogsRef = useRef(primaryLogs);
	const prevSplitLogsRef = useRef(splitLogs);

	// Extracted so the useEffect dependency array is exhaustive
	const resetViewState = useCallback(() => {
		setPrimaryScrollOffset(0);
		setPrimaryAutoScroll(true);
		setSplitScrollOffset(0);
		setSplitAutoScroll(true);
		setShowSearch(false);
		setShowRenameInput(false);
		setSearchQuery('');
		prevPrimaryLogsRef.current = 0;
		prevSplitLogsRef.current = 0;
	}, []);

	// Reset scroll and re-enable autoScroll when switching tabs or filters
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional triggers
	useEffect(() => {
		resetViewState();
	}, [activeTaskName, logFilter, resetViewState]);

	// Keep activeTaskName strictly in sync initially
	useEffect(() => {
		if (activeTask && activeTask !== activeTaskName) {
			setActiveTaskName(activeTask);
		}
	}, [activeTask, activeTaskName]);

	// Automatically mark stderr seen when switching tasks
	useEffect(() => {
		if (activeTaskName) markStderrSeen(activeTaskName);
	}, [activeTaskName, markStderrSeen]);

	useEffect(() => {
		if (splitTaskName) markStderrSeen(splitTaskName);
	}, [splitTaskName, markStderrSeen]);

	// When autoScroll is disabled, adjust scrollOffset to keep view stable as new logs arrive
	useEffect(() => {
		if (!primaryAutoScroll && primaryLogs > prevPrimaryLogsRef.current) {
			const newLogs = primaryLogs - prevPrimaryLogsRef.current;
			setPrimaryScrollOffset((prev: number) => prev + newLogs);
		}
		prevPrimaryLogsRef.current = primaryLogs;
	}, [primaryLogs, primaryAutoScroll]);

	useEffect(() => {
		if (!splitAutoScroll && splitLogs > prevSplitLogsRef.current) {
			const newLogs = splitLogs - prevSplitLogsRef.current;
			setSplitScrollOffset((prev: number) => prev + newLogs);
		}
		prevSplitLogsRef.current = splitLogs;
	}, [splitLogs, splitAutoScroll]);

	// Navigate to the left tab (with wrap)
	const navigateLeft = useCallback(() => {
		setActiveTaskName((prevName) => {
			const currentIndex = prevName ? tasks.indexOf(prevName) : 0;
			const validIndex = currentIndex >= 0 ? currentIndex : 0;
			const newIndex =
				validIndex === 0 ? Math.max(0, tasks.length - 1) : validIndex - 1;
			return tasks[newIndex] ?? prevName;
		});
	}, [tasks]);

	// Navigate to the right tab (with wrap)
	const navigateRight = useCallback(() => {
		setActiveTaskName((prevName) => {
			const currentIndex = prevName ? tasks.indexOf(prevName) : 0;
			const validIndex = currentIndex >= 0 ? currentIndex : 0;
			const newIndex = validIndex === tasks.length - 1 ? 0 : validIndex + 1;
			return tasks[newIndex] ?? prevName;
		});
	}, [tasks]);

	// Set active tab index directly (forces primary pane)
	const setActiveTabIndex = useCallback(
		(index: number) => {
			if (tasks[index]) {
				setActivePane('primary');
				setActiveTaskName(tasks[index]);
			}
		},
		[tasks],
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
		if (activePane === 'primary') {
			setPrimaryScrollOffset((prev: number) =>
				Math.min(prev + 1, Math.max(0, primaryLogs - viewHeight)),
			);
			setPrimaryAutoScroll(false);
		} else {
			setSplitScrollOffset((prev: number) =>
				Math.min(prev + 1, Math.max(0, splitLogs - viewHeight)),
			);
			setSplitAutoScroll(false);
		}
	}, [primaryLogs, splitLogs, viewHeight, activePane]);

	// Scroll down (toward bottom)
	const scrollDown = useCallback(() => {
		if (activePane === 'primary') {
			setPrimaryScrollOffset((prev: number) => {
				const newOffset = Math.max(0, prev - 1);
				if (newOffset === 0) setPrimaryAutoScroll(true);
				return newOffset;
			});
		} else {
			setSplitScrollOffset((prev: number) => {
				const newOffset = Math.max(0, prev - 1);
				if (newOffset === 0) setSplitAutoScroll(true);
				return newOffset;
			});
		}
	}, [activePane]);

	// Scroll to bottom and re-enable auto-scroll
	const scrollToBottom = useCallback(() => {
		if (activePane === 'primary') {
			setPrimaryScrollOffset(0);
			setPrimaryAutoScroll(true);
		} else {
			setSplitScrollOffset(0);
			setSplitAutoScroll(true);
		}
	}, [activePane]);

	// Toggle timestamps display
	const toggleTimestamps = useCallback(() => {
		setShowTimestamps((prev) => !prev);
	}, []);

	// Search actions
	const openSearch = useCallback(() => {
		setShowSearch(true);
	}, []);

	const closeSearch = useCallback(() => {
		setShowSearch(false);
		setSearchQuery('');
	}, []);

	const openRenameInput = useCallback(() => {
		setShowRenameInput(true);
		setShowSearch(false);
	}, []);

	const closeRenameInput = useCallback(() => {
		setShowRenameInput(false);
	}, []);

	// Calculate offset so the target item is roughly centered
	const scrollToIndex = useCallback(
		(index: number, total: number) => {
			if (total === 0) return;
			const halfView = Math.floor(viewHeight / 2);
			const targetBottomIndex = Math.min(total - 1, index + halfView);
			const computedOffset = Math.max(0, total - 1 - targetBottomIndex);

			if (activePane === 'primary') {
				setPrimaryScrollOffset(computedOffset);
				setPrimaryAutoScroll(computedOffset === 0);
			} else {
				setSplitScrollOffset(computedOffset);
				setSplitAutoScroll(computedOffset === 0);
			}
		},
		[viewHeight, activePane],
	);

	// View mode toggles
	const toggleFocusMode = useCallback(() => {
		setFocusMode((prev) => !prev);
	}, []);

	const toggleDisplayMode = useCallback(() => {
		setDisplayMode((prev) => (prev === 'full' ? 'compact' : 'full'));
	}, []);

	const cyclePaneFocus = useCallback(() => {
		setActivePane((prev) =>
			prev === 'primary' && splitTaskName !== null ? 'split' : 'primary',
		);
	}, [splitTaskName]);

	// Search matching logic moved from AppContent
	const activeLogs = useMemo(() => {
		if (!activeTask) return [];
		return getLogsForTask(activeTask, logFilter);
	}, [activeTask, logFilter, getLogsForTask]);

	const searchMatches = useMemo(() => {
		if (!searchQuery) return [];
		return activeLogs
			.map((log: LogEntry, index: number) =>
				log.text.toLowerCase().includes(searchQuery.toLowerCase())
					? index
					: -1,
			)
			.filter((index: number) => index !== -1);
	}, [activeLogs, searchQuery]);

	const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(null);

	// Auto reset match index on query change
	useEffect(() => {
		if (searchMatches.length > 0) {
			setCurrentMatchIndex(0);
			scrollToIndex(searchMatches[0]!, totalLogs);
		} else {
			setCurrentMatchIndex(null);
		}
	}, [searchMatches, scrollToIndex, totalLogs]);

	const nextMatch = useCallback(() => {
		if (searchMatches.length === 0) return;
		setCurrentMatchIndex((prev) => {
			const next =
				prev === null || prev >= searchMatches.length - 1 ? 0 : prev + 1;
			scrollToIndex(searchMatches[next]!, totalLogs);
			return next;
		});
	}, [searchMatches, scrollToIndex, totalLogs]);

	const prevMatch = useCallback(() => {
		if (searchMatches.length === 0) return;
		setCurrentMatchIndex((prev) => {
			const next =
				prev === null || prev <= 0 ? searchMatches.length - 1 : prev - 1;
			scrollToIndex(searchMatches[next]!, totalLogs);
			return next;
		});
	}, [searchMatches, scrollToIndex, totalLogs]);

	const lastKnownIndexRef = useRef(0);
	useEffect(() => {
		if (activeTaskName && tasks.includes(activeTaskName)) {
			lastKnownIndexRef.current = tasks.indexOf(activeTaskName);
		}
	}, [tasks, activeTaskName]);

	// Adjust active tab if activeTaskName is orphaned
	useEffect(() => {
		if (tasks.length === 0) {
			setActiveTaskName(null);
		} else if (activeTaskName && !tasks.includes(activeTaskName)) {
			// fallback to the previous index logic visually
			const fallbackIndex = Math.min(
				lastKnownIndexRef.current,
				tasks.length - 1,
			);
			setActiveTaskName(tasks[fallbackIndex] ?? tasks[0] ?? null);
		}
	}, [tasks, activeTaskName]);

	return {
		activeTabIndex,
		activeTask,
		logFilter,
		primaryScrollOffset,
		primaryAutoScroll,
		activePane,
		splitTaskName,
		splitScrollOffset,
		splitAutoScroll,
		viewHeight,
		totalLogs,
		navigateLeft,
		navigateRight,
		setActiveTabIndex,
		cycleLogFilter,
		scrollUp,
		scrollDown,
		scrollToBottom,
		showTimestamps,
		toggleTimestamps,
		showSearch,
		searchQuery,
		searchMatches,
		currentMatchIndex,
		showRenameInput,
		focusMode,
		displayMode,
		openSearch,
		closeSearch,
		openRenameInput,
		closeRenameInput,
		setSearchQuery,
		scrollToIndex,
		toggleFocusMode,
		toggleDisplayMode,
		cyclePaneFocus,
		nextMatch,
		prevMatch,
	};
};
