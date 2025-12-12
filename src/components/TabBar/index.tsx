import { Badge, Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import {
	TAB_BAR_INDEX_COLORS,
	TAB_BAR_STATUS_COLORS,
} from './TabBar.consts.js';
import type { TabBarProps } from './TabBar.types.js';

export function TabBar({ tasks, taskStates, activeTabIndex }: TabBarProps) {
	return (
		<Box borderStyle="round" borderColor="gray" paddingX={1} gap={2}>
			{tasks.map((task, index) => {
				const isActive = index === activeTabIndex;
				const taskState = taskStates[task];
				const color = TAB_BAR_INDEX_COLORS[index % TAB_BAR_INDEX_COLORS.length];
				const showStderrFlag = taskState.hasUnseenStderr;

				return (
					<Box key={task} gap={1}>
						{isActive ? (
							<Text backgroundColor={color} color="white" bold>
								{task}
							</Text>
						) : (
							<Text color={color}>{task}</Text>
						)}
						{showStderrFlag && <Badge color="red">ERR</Badge>}
						{taskState.status === TASK_STATUS.RUNNING ? (
							<Spinner />
						) : (
							<Badge color={TAB_BAR_STATUS_COLORS[taskState.status]}>
								{taskState.status}
							</Badge>
						)}
					</Box>
				);
			})}
		</Box>
	);
}
