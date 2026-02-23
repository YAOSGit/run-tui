import { Box, Text, useInput } from 'ink';
import { useCallback, useMemo, useState } from 'react';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { fuzzyFilter } from '../../utils/fuzzyMatch/index.js';
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
	const [query, setQuery] = useState('');
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Scripts that aren't already running
	const candidates = useMemo(
		() => availableScripts.filter((s) => !runningScripts.includes(s)),
		[availableScripts, runningScripts],
	);

	// Fuzzy-filtered and ranked results
	const results = useMemo(
		() => fuzzyFilter(candidates, query, (s) => s),
		[candidates, query],
	);

	// Keep selectedIndex in bounds when results change
	const clampedIndex = Math.min(selectedIndex, Math.max(0, results.length - 1));

	// Total overhead: Header(1) + Input(1) + Footer(4 + 1 marginTop) + Match Count(hasCandidates ? 1 : 0) + Gaps(hasCandidates ? 4 : 3) = 12 or 10
	const staticLines = candidates.length > 0 ? 12 : 10;
	const visibleCount = Math.max(1, height - staticLines);
	const scrollOffset = Math.max(0, clampedIndex - visibleCount + 1);
	const visibleResults = results.slice(
		scrollOffset,
		scrollOffset + visibleCount,
	);

	const handleSelect = useCallback(() => {
		const selected = results[clampedIndex];
		if (selected) {
			onSelect(selected.item);
		}
	}, [results, clampedIndex, onSelect]);

	useInput((input, key) => {
		if (key.escape || input.toLowerCase() === 'q') {
			onCancel();
			return;
		}

		if (key.return) {
			handleSelect();
			return;
		}

		if (key.upArrow) {
			setSelectedIndex((prev) => Math.max(0, prev - 1));
			return;
		}

		if (key.downArrow) {
			setSelectedIndex((prev) => Math.min(results.length - 1, prev + 1));
			return;
		}

		if (key.backspace || key.delete) {
			setQuery((prev) => prev.slice(0, -1));
			setSelectedIndex(0);
			return;
		}

		// Any printable character updates the query
		if (input && !key.ctrl && !key.meta) {
			setQuery((prev) => prev + input);
			setSelectedIndex(0);
		}
	});

	return (
		<Box flexDirection="column" gap={1}>
			{/* Header */}
			<Box>
				<Text bold color="magenta">
					Select a script to run:
				</Text>
			</Box>

			{/* Search input */}
			<Box>
				<Text color="cyan">{'> '}</Text>
				<Text>{query}</Text>
				<Text color="cyan">{'_'}</Text>
			</Box>

			{/* Results list */}
			<Box flexDirection="column" height={visibleCount}>
				{candidates.length === 0 ? (
					<Box flexDirection="column" gap={1}>
						<Text dimColor>All scripts are already running.</Text>
						<Text dimColor>Press ESC or q to go back.</Text>
					</Box>
				) : results.length === 0 ? (
					<Text dimColor>No scripts match "{query}"</Text>
				) : (
					visibleResults.map(({ item: script }, i) => {
						const absoluteIndex = scrollOffset + i;
						const isSelected = absoluteIndex === clampedIndex;
						return (
							<Box key={script}>
								<Text color={isSelected ? 'cyan' : undefined}>
									{isSelected ? '● ' : '  '}
								</Text>
								<Text bold={isSelected} color={isSelected ? 'cyan' : undefined}>
									{script}
								</Text>
							</Box>
						);
					})
				)}
			</Box>

			{/* Match count */}
			{candidates.length > 0 && (
				<Box>
					<Text dimColor>
						{query
							? `${results.length} match${results.length !== 1 ? 'es' : ''} (of ${candidates.length} scripts)`
							: `${candidates.length} script${candidates.length !== 1 ? 's' : ''}`}
					</Text>
				</Box>
			)}

			<Footer
				commands={SCRIPT_SELECTOR_COMMANDS}
				activeTask={undefined}
				status={undefined}
				logFilter={null}
			/>
		</Box>
	);
}
