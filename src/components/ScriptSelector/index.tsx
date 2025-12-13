import { Select } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useMemo } from 'react';
import type { ScriptSelectorProps } from './ScriptSelector.types.js';

export function ScriptSelector({
	availableScripts,
	runningScripts,
	onSelect,
	onCancel,
	height,
}: ScriptSelectorProps) {
	useInput((input, key) => {
		if (key.escape || input.toLowerCase() === 'q') {
			onCancel();
		}
	});

	const selectableItems = useMemo(() => {
		return availableScripts
			.filter((script) => !runningScripts.includes(script))
			.map((script) => ({
				label: script,
				value: script,
			}));
	}, [availableScripts, runningScripts]);

	const selectHeight = height + 2;

	return (
		<Box flexDirection="column" gap={1}>
			<Box>
				<Text bold color="magenta">
					Select a script to run:
				</Text>
			</Box>

			<Box height={selectHeight}>
				{selectableItems.length === 0 ? (
					<Box flexDirection="column" gap={1}>
						<Text dimColor>All scripts are already running.</Text>
						<Text dimColor>Press ESC or q to go back.</Text>
					</Box>
				) : (
					<Select
						options={selectableItems}
						visibleOptionCount={selectHeight}
						onChange={(value) => onSelect(value)}
					/>
				)}
			</Box>

			<Box borderStyle="round" borderColor="gray" paddingX={1} marginTop={1}>
				<Text>
					<Text bold color="magenta">
						YAOSGit
					</Text>
					<Text dimColor> : </Text>
					<Text>run</Text>
					<Text dimColor> │ </Text>
					<Text bold>↑/↓</Text> navigate
					<Text dimColor> │ </Text>
					<Text bold>Enter</Text> select
					<Text dimColor> │ </Text>
					<Text bold>ESC/q</Text> cancel
				</Text>
			</Box>
		</Box>
	);
}
