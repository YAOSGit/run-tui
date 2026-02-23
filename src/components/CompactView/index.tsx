import { Box, Text } from 'ink';
import type React from 'react';
import { useLogs } from '../../providers/LogsProvider/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { TAB_BAR_STATUS_COLORS } from '../TabBar/TabBar.consts.js';
import { TaskTime } from '../TaskTime/index.js';

interface CompactViewProps {
	tasks: string[];
	taskStates: Record<string, TaskState>;
	pinnedTasks: string[];
	tabAliases: Record<string, string>;
	activeTabIndex: number;
	width: number;
	height: number;
}

export const CompactView: React.FC<CompactViewProps> = ({
	tasks,
	taskStates,
	pinnedTasks,
	tabAliases,
	activeTabIndex,
	width,
	height,
}) => {
	const { getLogsForTask } = useLogs();

	let startIndex = 0;
	if (tasks.length > height) {
		startIndex = Math.max(0, activeTabIndex - Math.floor(height / 2));
		if (startIndex + height > tasks.length) {
			startIndex = tasks.length - height;
		}
	}

	const visibleTasks = tasks.slice(startIndex, startIndex + height);

	return (
		<Box flexDirection="column" width={width} height={height}>
			{visibleTasks.map((taskName, index) => {
				const state = taskStates[taskName];
				const isActive = activeTabIndex === startIndex + index;

				// Get just the last 1 log line for this task to display
				const logs = getLogsForTask(taskName, null, 1);
				const lastLog = logs.length > 0 ? logs[logs.length - 1]?.text : '';
				const isPinned = pinnedTasks.includes(taskName);

				const statusColor = state
					? TAB_BAR_STATUS_COLORS[state.status]
					: 'gray';

				return (
					<Box key={taskName} width={width} overflowX="hidden">
						<Text color={isActive ? 'cyan' : undefined} bold={isActive}>
							{isActive ? '> ' : '  '}
						</Text>
						<Box width={15} flexShrink={0}>
							<Text color={statusColor} wrap="truncate">
								[{state?.status ?? TASK_STATUS.PENDING}]
							</Text>
						</Box>
						<Box width={30} flexShrink={0}>
							<Text bold wrap="truncate">
								{isPinned ? '📌 ' : ''}
								{tabAliases[taskName] ?? taskName}
								<TaskTime
									startedAt={state?.startedAt ?? null}
									endedAt={state?.endedAt ?? null}
								/>
							</Text>
						</Box>
						<Box flexGrow={1} overflowX="hidden">
							<Text dimColor wrap="truncate">
								{lastLog ? ` | ${lastLog}` : ' | ...'}
							</Text>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};
