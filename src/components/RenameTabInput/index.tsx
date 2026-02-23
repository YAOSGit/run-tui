import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { Footer } from '../Footer/index.js';

export interface RenameTabInputProps {
	initialName: string;
	onRename: (newName: string) => void;
	onClose: () => void;
}

const RENAME_COMMANDS: VisibleCommand[] = [
	{ displayKey: 'Enter', displayText: 'confirm' },
	{ displayKey: 'ESC', displayText: 'cancel' },
];

export function RenameTabInput({
	initialName,
	onRename,
	onClose,
}: RenameTabInputProps) {
	const [value, setValue] = useState(initialName);

	useInput((input, key) => {
		if (key.escape) {
			onClose();
			return;
		}

		if (key.return) {
			onRename(value.trim() || initialName);
			onClose();
			return;
		}

		if (key.backspace || key.delete) {
			setValue((prev) => prev.slice(0, -1));
			return;
		}

		// Any printable character updates the value
		if (input && !key.ctrl && !key.meta) {
			setValue((prev) => prev + input);
		}
	});

	return (
		<Box flexDirection="column" gap={0}>
			<Box>
				<Text color="yellow">rename: </Text>
				<Text>{value}</Text>
				<Text color="yellow">{'_'}</Text>
			</Box>
			<Footer
				commands={RENAME_COMMANDS}
				activeTask={undefined}
				status={undefined}
				logFilter={null}
			/>
		</Box>
	);
}
