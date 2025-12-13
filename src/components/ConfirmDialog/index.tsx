import { StatusMessage } from '@inkjs/ui';
import { Box, Text } from 'ink';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import { STATUS_VARIANTS } from '../Footer/Footer.consts.js';

export interface ConfirmDialogProps {
	message: string;
	activeTask?: string;
	status?: TaskStatus;
}

export function ConfirmDialog({
	message,
	activeTask,
	status,
}: ConfirmDialogProps) {
	return (
		<Box marginTop={1} flexDirection="column" gap={1}>
			{activeTask && status ? (
				<Box>
					<StatusMessage variant={STATUS_VARIANTS[status]}>
						<Text bold>{activeTask}</Text>
						<Text dimColor> - </Text>
						<Text color="yellow">{message}</Text>
					</StatusMessage>
				</Box>
			) : (
				<Box>
					<StatusMessage variant="warning">{message}</StatusMessage>
				</Box>
			)}
			<Box borderStyle="round" borderColor="gray" paddingX={1}>
				<Text wrap="end">
				<Text bold color="magenta">
						YAOSGit
					<Text dimColor> : </Text>
					run
					</Text>
					<Text dimColor> │ </Text>
					<Text bold>y</Text> yes
					<Text dimColor> │ </Text>
					<Text bold>n</Text> no
				</Text>
			</Box>
		</Box>
	);
}
