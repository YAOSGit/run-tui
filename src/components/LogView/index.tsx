import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import { COLOR } from '../../types/Color/index.js';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { highlightLog } from '../../utils/syntaxHighlight/index.js';
import type { LogViewProps } from './LogView.types.js';

export function LogView({
	logs,
	height = 20,
	width = 80,
	isRunning = false,
	lineOverflow = LINE_OVERFLOW.WRAP,
	showTimestamps = false,
	searchQuery = '',
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
							{showTimestamps && (
								<>
									<Text dimColor wrap="truncate">
										[{log.timestamp}]
									</Text>
									<Text wrap="truncate"> </Text>
								</>
							)}
							<Text
								color={log.type === LOG_TYPE.STDERR ? COLOR.RED : undefined}
								wrap={lineOverflow}
							>
								{searchQuery
									? (() => {
											// Split text by query case-insensitively
											const lowerText = log.text.toLowerCase();
											const lowerQuery = searchQuery.toLowerCase();
											const parts = [];
											let lastIndex = 0;
											let index = lowerText.indexOf(lowerQuery);

											while (index !== -1) {
												// Add unhighlighted part before match
												if (index > lastIndex) {
													const chunk = log.text.slice(lastIndex, index);
													parts.push(
														<Text key={`${log.id}-text-${lastIndex}`}>
															{highlightLog(chunk)}
														</Text>,
													);
												}
												// Add highlighted match
												parts.push(
													<Text
														key={`${log.id}-match-${index}`}
														backgroundColor="yellow"
														color="black"
													>
														{log.text.slice(index, index + searchQuery.length)}
													</Text>,
												);
												lastIndex = index + searchQuery.length;
												index = lowerText.indexOf(lowerQuery, lastIndex);
											}
											// Add remaining unhighlighted part
											if (lastIndex < log.text.length) {
												const chunk = log.text.slice(lastIndex);
												parts.push(
													<Text key={`${log.id}-text-end`}>
														{highlightLog(chunk)}
													</Text>,
												);
											}

											return parts.length > 0 ? parts : highlightLog(log.text);
										})()
									: highlightLog(log.text)}
							</Text>
						</Box>
					),
				)
			)}
		</Box>
	);
}
