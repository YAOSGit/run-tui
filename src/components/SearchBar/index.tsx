import { Box, Text, useInput } from 'ink';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { Footer } from '../Footer/index.js';

export interface SearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
	matchesCount: number;
	currentMatchIndex: number | null;
	onClose: () => void;
	onNextMatch: () => void;
	onPrevMatch: () => void;
}

const SEARCH_COMMANDS: VisibleCommand[] = [
	{ displayKey: 'Enter', displayText: 'confirm' },
	{ displayKey: 'ESC', displayText: 'cancel' },
	{ displayKey: '↑ / ↓', displayText: 'next/prev' },
];

export function SearchBar({
	query,
	onQueryChange,
	matchesCount,
	currentMatchIndex,
	onClose,
	onNextMatch,
	onPrevMatch,
}: SearchBarProps) {
	useInput((input, key) => {
		if (key.escape) {
			onClose();
			return;
		}

		if (key.return) {
			onClose();
			return;
		}

		if (key.backspace || key.delete) {
			onQueryChange(query.slice(0, -1));
			return;
		}

		// Handle UP/DOWN arrows for navigation when searching
		if (key.downArrow) {
			onNextMatch();
			return;
		}
		if (key.upArrow) {
			onPrevMatch();
			return;
		}

		// Any printable character updates the query
		if (input && !key.ctrl && !key.meta) {
			onQueryChange(query + input);
		}
	});

	const displayMatchCount =
		matchesCount > 0 && currentMatchIndex !== null
			? `[${currentMatchIndex + 1}/${matchesCount}]`
			: matchesCount === 0 && query.length > 0
				? '[0/0]'
				: '';

	return (
		<Box flexDirection="column" gap={0}>
			<Box>
				<Text color="yellow">{'/'}</Text>
				<Text>{query}</Text>
				<Text color="yellow">{'_'}</Text>
				<Box flexGrow={1} />
				{displayMatchCount && <Text dimColor>{displayMatchCount}</Text>}
			</Box>
			<Footer
				commands={SEARCH_COMMANDS}
				activeTask={undefined}
				status={undefined}
				logFilter={null}
			/>
		</Box>
	);
}
