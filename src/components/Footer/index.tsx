import { StatusMessage } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { STATUS_VARIANTS } from './Footer.consts.js';
import type { FooterProps } from './Footer.types.js';

export function Footer({ activeTask, status, logFilter }: FooterProps) {
	return (
		<Box marginTop={1} flexDirection="column" gap={1}>
			<Box>
				<StatusMessage variant={STATUS_VARIANTS[status]}>
					<Text bold>{activeTask}</Text>
					<Text dimColor> - {status}</Text>
					<Text dimColor> [{logFilter ?? 'all'}]</Text>
				</StatusMessage>
			</Box>
			<Box borderStyle="round" borderColor="gray" paddingX={1}>
				<Text>
					<Text bold color="cyan">
						RUN-TUI
					</Text>
					<Text dimColor> │ </Text>
					<Text bold>←/→</Text> switch
					<Text dimColor> │ </Text>
					<Text bold>f</Text> filter
					<Text dimColor> │ </Text>
					<Text bold>k</Text> kill
					<Text dimColor> │ </Text>
					<Text bold>q</Text> quit
				</Text>
			</Box>
		</Box>
	);
}
