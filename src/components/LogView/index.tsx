import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { COLOR } from '../../types/Color/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import type { LogViewProps } from './LogView.types.js';

export function LogView({
	logs,
	height = 20,
	isRunning = false,
}: LogViewProps) {
	return (
		<Box flexDirection="column" height={height}>
			{logs.length === 0 ? (
				<Box gap={1}>
					{isRunning && <Spinner />}
					<Text dimColor>Waiting for output...</Text>
				</Box>
			) : (
				logs.map((log) => (
					<Box key={log.id}>
						<Text dimColor>[{log.timestamp}]</Text>
						<Text> </Text>
						<Text color={log.type === LOG_TYPE.STDERR ? COLOR.RED : undefined}>
							{log.text}
						</Text>
					</Box>
				))
			)}
		</Box>
	);
}
