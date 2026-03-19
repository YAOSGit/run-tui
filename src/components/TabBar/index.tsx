import { StatusIcon } from '@yaos-git/toolkit/tui/components';
import { Box, Text } from 'ink';
import { useMemo } from 'react';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { theme } from '../../theme.js';
import { TaskTime } from '../TaskTime/index.js';
import { ACTIVE_TAB_TEXT_COLOR, TAB_BAR_INDEX_COLORS } from './TabBar.consts.js';
import type { TabBarProps } from './TabBar.types.js';

const STATUS_ICON_MAP: Record<string, string> = {
	[TASK_STATUS.PENDING]: 'idle',
	[TASK_STATUS.RUNNING]: 'running',
	[TASK_STATUS.SUCCESS]: 'success',
	[TASK_STATUS.ERROR]: 'error',
	[TASK_STATUS.RESTARTING]: 'running',
};

// Estimate tab width: task name + space + icon + gap
const estimateTabWidth = (
	taskName: string,
	status: string,
	hasStderrBadge: boolean,
	isPinned: boolean,
): number => {
	// StatusIcon is 1 char wide for all states
	const badgeWidth = 1;
	const stderrBadgeWidth = hasStderrBadge ? 5 : 0; // " ERR " + gap
	const pinWidth = isPinned ? 3 : 0; // "📌 "
	const timeWidth = status !== 'pending' ? 8 : 0; // e.g. " (2m 1s)" overhead
	return (
		taskName.length +
		1 +
		badgeWidth +
		stderrBadgeWidth +
		pinWidth +
		timeWidth +
		4
	); // name + space + badge + stderr + restart/pin/time overhead
};

// Parent Box: border (2) + padding (2) = 4
// TabBar Box: border (2) + paddingX (2) = 4
// Arrow boxes are accounted separately
// Extra buffer to prevent edge wrapping
const TOTAL_OVERHEAD = 14;

// Arrow indicators: "◀ N" or "N ▶" plus gaps
const ARROW_WIDTH = 6;

export function TabBar({
	tasks,
	taskStates,
	pinnedTasks,
	tabAliases,
	activeTabIndex,
	width = 80,
}: TabBarProps) {
	// Calculate which tabs fit and which to show
	const { visibleTasks, startIndex, showLeftArrow, showRightArrow } =
		useMemo(() => {
			if (tasks.length === 0) {
				return {
					visibleTasks: [],
					startIndex: 0,
					showLeftArrow: false,
					showRightArrow: false,
				};
			}

			// Calculate width of each tab
			const tabWidths = tasks.map((task) => {
				const status = taskStates[task]?.status ?? 'pending';
				const hasStderrBadge = taskStates[task]?.hasUnseenStderr ?? false;
				const isPinned = pinnedTasks.includes(task);
				const displayTaskName = tabAliases[task] ?? task;
				return estimateTabWidth(
					displayTaskName,
					status,
					hasStderrBadge,
					isPinned,
				);
			});

			// Gap between tabs (gap={2} means 2 spaces between each tab)
			const gapsBetweenTabs = (count: number) =>
				count > 1 ? (count - 1) * 2 : 0;

			const totalTabsWidth =
				tabWidths.reduce((sum, w) => sum + w, 0) +
				gapsBetweenTabs(tasks.length);
			const availableWidth = width - TOTAL_OVERHEAD;

			// If all tabs fit, show them all
			if (totalTabsWidth <= availableWidth) {
				return {
					visibleTasks: tasks,
					startIndex: 0,
					showLeftArrow: false,
					showRightArrow: false,
				};
			}

			// Need to scroll - find which tabs to show
			// Start from active tab and expand outward
			let start = activeTabIndex;
			let end = activeTabIndex;
			let currentWidth = tabWidths[activeTabIndex];

			// Reserve space for arrows on both sides
			const maxWidth = availableWidth - ARROW_WIDTH * 2;

			// Expand to include more tabs while they fit
			let expanded = true;
			while (expanded) {
				expanded = false;

				// Try to add tab to the left
				if (start > 0) {
					const newWidth = currentWidth + tabWidths[start - 1] + 2; // +2 for gap
					if (newWidth <= maxWidth) {
						start--;
						currentWidth = newWidth;
						expanded = true;
					}
				}

				// Try to add tab to the right
				if (end < tasks.length - 1) {
					const newWidth = currentWidth + tabWidths[end + 1] + 2; // +2 for gap
					if (newWidth <= maxWidth) {
						end++;
						currentWidth = newWidth;
						expanded = true;
					}
				}
			}

			return {
				visibleTasks: tasks.slice(start, end + 1),
				startIndex: start,
				showLeftArrow: start > 0,
				showRightArrow: end < tasks.length - 1,
			};
		}, [tasks, taskStates, pinnedTasks, tabAliases, activeTabIndex, width]);

	const hiddenRight = tasks.length - startIndex - visibleTasks.length;

	if (tasks.length === 0) {
		return null;
	}

	return (
		<Box width="100%" borderStyle="round" borderColor="gray" paddingX={1}>
			{/* Left arrow - fixed position */}
			<Box width={ARROW_WIDTH}>
				{showLeftArrow && <Text dimColor>◀ {startIndex}</Text>}
			</Box>

			{/* Tabs - centered, take remaining space */}
			<Box flexGrow={1} justifyContent="space-between" gap={2}>
				{visibleTasks.map((task) => {
					const originalIndex = tasks.indexOf(task);
					const isActive = originalIndex === activeTabIndex;
					const taskState = taskStates[task];
					const color =
						TAB_BAR_INDEX_COLORS[originalIndex % TAB_BAR_INDEX_COLORS.length];
					const showStderrFlag = taskState?.hasUnseenStderr;
					const isPinned = pinnedTasks.includes(task);
					const displayTaskName = tabAliases[task] ?? task;

					return (
						<Box key={task} gap={1}>
							{isActive ? (
								<Text backgroundColor={color} color={ACTIVE_TAB_TEXT_COLOR} bold>
									{isPinned ? '📌 ' : ''}
									{displayTaskName}
									<TaskTime
										startedAt={taskState?.startedAt ?? null}
										endedAt={taskState?.endedAt ?? null}
									/>
								</Text>
							) : (
								<Text color={color}>
									{isPinned ? '📌 ' : ''}
									{displayTaskName}
									<TaskTime
										startedAt={taskState?.startedAt ?? null}
										endedAt={taskState?.endedAt ?? null}
									/>
								</Text>
							)}
							{showStderrFlag && <Text color={theme.error} bold>ERR</Text>}
							{taskState?.restartCount && taskState.restartCount > 0 ? (
								<Text color={theme.warning}>↻{taskState.restartCount}</Text>
							) : null}
							<StatusIcon status={STATUS_ICON_MAP[taskState?.status ?? 'pending'] ?? 'idle'} />
						</Box>
					);
				})}
			</Box>

			{/* Right arrow - fixed position */}
			<Box width={ARROW_WIDTH} justifyContent="flex-end">
				{showRightArrow && <Text dimColor>{hiddenRight} ▶</Text>}
			</Box>
		</Box>
	);
}
