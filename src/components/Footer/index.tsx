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

	const terminalWidth = process.stdout.columns || 80;
	const availableWidth = terminalWidth - 8; // border left/right (2) + paddingX=1 left/right (2) + 4 for the first/last separator
	let currentWidth = 13; // "YAOSGit : run"

	const priorityCommands = commands.filter((cmd) => cmd.priority);
	const optionalCommands = commands.filter((cmd) => !cmd.priority);

	const truncatedCommands: typeof commands = [];

	// Add priority commands
	for (const cmd of priorityCommands) {
		const cmdWidth = 3 + String(cmd.displayKey).length + 1 + cmd.displayText.length;
		truncatedCommands.push(cmd);
		currentWidth += cmdWidth;
	}

	// Fill remainder of space with optional commands
	for (const cmd of optionalCommands) {
		const cmdWidth = 3 + String(cmd.displayKey).length + 1 + cmd.displayText.length;
		if (currentWidth + cmdWidth <= availableWidth) {
			truncatedCommands.push(cmd);
			currentWidth += cmdWidth;
		} else {
			break;
		}
	}

	// Re-sort back to original chronological order
	const finalCommands = commands.filter((cmd) => truncatedCommands.includes(cmd));

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
					{finalCommands.map((cmd) => (
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
