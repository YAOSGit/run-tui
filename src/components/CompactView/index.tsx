import { Box, Text } from 'ink';
import { useLogs } from '../../providers/LogsProvider/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { TAB_BAR_STATUS_COLORS } from '../TabBar/TabBar.consts.js';
import { TaskTime } from '../TaskTime/index.js';

type CompactViewProps = {
	tasks: string[];
	taskStates: Record<string, TaskState>;
	pinnedTasks: string[];
	tabAliases: Record<string, string>;
	activeTabIndex: number;
	maxVisible: number;
};

export function CompactView({
	tasks,
	taskStates,
	pinnedTasks,
	tabAliases,
	activeTabIndex,
	maxVisible,
}: CompactViewProps) {
	const { getLogsForTask } = useLogs();

	const viewportSize = Math.min(tasks.length, maxVisible);
	let startIndex = 0;
	if (tasks.length > viewportSize) {
		startIndex = Math.max(0, activeTabIndex - Math.floor(viewportSize / 2));
		if (startIndex + viewportSize > tasks.length) {
			startIndex = tasks.length - viewportSize;
		}
	}

	const visibleTasks = tasks.slice(startIndex, startIndex + viewportSize);

	return (
		<Box flexDirection="column" flexGrow={1}>
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
					<Box key={taskName} overflowX="hidden">
						<Text color={isActive ? 'cyan' : undefined} bold={isActive}>
							{isActive ? '> ' : '  '}
						</Text>
						<Box width={15} flexShrink={0}>
							<Text color={statusColor} wrap="truncate">
								[{(state?.status ?? TASK_STATUS.PENDING).toUpperCase()}]
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
}
