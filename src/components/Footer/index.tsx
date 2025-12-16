import { StatusMessage } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { STATUS_VARIANTS } from './Footer.consts.js';
import type { FooterProps } from './Footer.types.js';

export function Footer({
	commands,
	activeTask,
	status,
	logFilter,
	scrollInfo,
}: FooterProps) {
	const scrollIndicator = scrollInfo && scrollInfo.totalLogs > 0 && (
		<Text dimColor>
			{scrollInfo.startLine}-{scrollInfo.endLine}/{scrollInfo.totalLogs}
			{scrollInfo.autoScroll ? (
				<Text color="green"> ▶</Text>
			) : (
				<Text color="yellow"> ⏸</Text>
			)}
		</Text>
	);

	return (
		<Box marginTop={1} flexDirection="column" gap={1}>
			{activeTask && status && (
				<Box justifyContent="space-between">
					<StatusMessage variant={STATUS_VARIANTS[status]}>
						<Text bold>{activeTask}</Text>
						<Text dimColor> - {status}</Text>
						<Text dimColor> [{logFilter ?? 'all'}]</Text>
					</StatusMessage>
					{scrollIndicator}
				</Box>
			)}
			<Box borderStyle="round" borderColor="gray" paddingX={1}>
				<Text wrap="end">
					<Text bold color="magenta">
						YAOSGit
						<Text dimColor> : </Text>
						run
					</Text>
					{commands.map((cmd) => (
						<Text key={`${cmd.displayKey}-${cmd.displayText}`}>
							<Text dimColor> │ </Text>
							<Text bold>{cmd.displayKey}</Text> {cmd.displayText}
						</Text>
					))}
				</Text>
			</Box>
		</Box>
	);
}
