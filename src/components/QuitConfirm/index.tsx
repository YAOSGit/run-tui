import { StatusMessage } from '@inkjs/ui';
import { Box, Text } from 'ink';
import type { QuitConfirmProps } from './QuitConfirm.types.js';

export function QuitConfirm({ runningCount }: QuitConfirmProps) {
	return (
		<Box marginTop={1} flexDirection="column" gap={1}>
			<Box>
				<StatusMessage variant="warning">
					{runningCount} task{runningCount > 1 ? 's' : ''} still running. Quit
					and kill all processes?
				</StatusMessage>
			</Box>
			<Box borderStyle="round" borderColor="gray" paddingX={1}>
				<Text>
					<Text bold color="cyan">
						RUN-TUI
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
