import { Select } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useMemo } from 'react';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { Footer } from '../Footer/index.js';
import type { ScriptSelectorProps } from './ScriptSelector.types.js';

const SCRIPT_SELECTOR_COMMANDS: VisibleCommand[] = [
	{ displayKey: '↑ / ↓', displayText: 'navigate' },
	{ displayKey: 'Enter', displayText: 'select' },
	{ displayKey: 'q / ESC', displayText: 'cancel' },
];

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

			<Footer
				commands={SCRIPT_SELECTOR_COMMANDS}
				activeTask={undefined}
				status={undefined}
				logFilter={null}
			/>
		</Box>
	);
}
