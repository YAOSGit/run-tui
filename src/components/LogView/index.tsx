import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { COLOR } from '../../types/Color/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import type { LogViewProps } from './LogView.types.js';

export function LogView({
	logs,
	height = 20,
	width = 80,
	isRunning = false,
}: LogViewProps) {
	// Build full divider string that fits within width
	// Format: "───── text ─────" (line + space + text + space + line)
	const getDivider = (text: string) => {
		const middle = ` ${text} `;
		const remainingWidth = width - middle.length - 4; // -4 for box borders/padding
		const lineLength = Math.max(0, Math.floor(remainingWidth / 2));
		return '─'.repeat(lineLength) + middle + '─'.repeat(lineLength);
	};

	return (
		<Box flexDirection="column" height={height}>
			{logs.length === 0 ? (
				<Box gap={1}>
					{isRunning && <Spinner />}
					<Text dimColor>Waiting for output...</Text>
				</Box>
			) : (
				logs.map((log) =>
					log.type === LOG_TYPE.DIVIDER ? (
						<Box key={log.id}>
							<Text dimColor wrap="truncate">
								{getDivider(log.text)}
							</Text>
						</Box>
					) : (
						<Box key={log.id}>
							<Text dimColor>[{log.timestamp}]</Text>
							<Text> </Text>
							<Text
								color={log.type === LOG_TYPE.STDERR ? COLOR.RED : undefined}
							>
								{log.text}
							</Text>
						</Box>
					),
				)
			)}
		</Box>
	);
}
