import { Box, type Key, Text, useInput, useStdout } from 'ink';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CompactView } from '../components/CompactView/index.js';
import { ConfirmDialog } from '../components/ConfirmDialog/index.js';
import { Footer } from '../components/Footer/index.js';
import { HelpMenu } from '../components/HelpMenu/index.js';
import { LogView } from '../components/LogView/index.js';
import { RenameTabInput } from '../components/RenameTabInput/index.js';
import { ScriptSelector } from '../components/ScriptSelector/index.js';
import { SearchBar } from '../components/SearchBar/index.js';
import { TabBar } from '../components/TabBar/index.js';
import { useCommands } from '../providers/CommandsProvider/index.js';
import { useLogs } from '../providers/LogsProvider/index.js';
import { useTasks } from '../providers/TasksProvider/index.js';
import { useUIState } from '../providers/UIStateProvider/index.js';
import { useView } from '../providers/ViewProvider/index.js';
import { MOD_KEY } from '../utils/platform/index.js';

export interface AppContentProps {
	availableScripts: string[];
	keepAlive: boolean;
	height?: number;
	width: number;
	onQuit: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({
	availableScripts,
	keepAlive,
	height,
	width,
	onQuit,
}) => {
	const tasks = useTasks();
	const logs = useLogs();
	const view = useView();
	const ui = useUIState();
	const commands = useCommands();

	const { stdout } = useStdout();
	const [columns, setColumns] = useState(
		stdout?.columns || process.stdout.columns || width,
	);
	const [rows, setRows] = useState(
		stdout?.rows || process.stdout.rows || height || 24,
	);

	useEffect(() => {
		if (!stdout) return;
		const handleResize = () => {
			setColumns(stdout.columns || process.stdout.columns || width);
			setRows(stdout.rows || process.stdout.rows || height || 24);
		};
		handleResize();
		stdout.on('resize', handleResize);
		return () => {
			stdout.off('resize', handleResize);
		};
	}, [stdout, width, height]);

	const effectiveHeight = rows;
	const effectiveWidth = columns;

	// Handle quit - kill all tasks then call onQuit
	const handleQuitWithCleanup = useCallback(() => {
		tasks.killAllTasks();
		onQuit();
	}, [tasks, onQuit]);

	// Handle script selection
	const handleSelectScript = useCallback(
		(script: string) => {
			tasks.addTask(script);
			// Set active tab to the new task
			view.setActiveTabIndex(tasks.tasks.length);
			ui.closeScriptSelector();
		},
		[tasks, view, ui],
	);

	// Handle cancel selector
	const handleCancelSelector = useCallback(() => {
		if (tasks.tasks.length === 0 && !keepAlive) {
			handleQuitWithCleanup();
		} else {
			ui.closeScriptSelector();
		}
	}, [tasks.tasks.length, keepAlive, handleQuitWithCleanup, ui]);



	// Handle SIGINT
	useEffect(() => {
		const handleSigint = () => {
			ui.closeScriptSelector();
			if (tasks.tasks.length === 0 && !keepAlive) {
				handleQuitWithCleanup();
			}
			if (tasks.hasRunningTasks || keepAlive) {
				commands.handleInput('q', {
					escape: false,
					return: false,
					ctrl: false,
					shift: false,
					tab: false,
					backspace: false,
					delete: false,
					upArrow: false,
					downArrow: false,
					leftArrow: false,
					rightArrow: false,
					pageDown: false,
					pageUp: false,
					meta: false,
				} as Key);
			} else {
				handleQuitWithCleanup();
			}
		};

		process.on('SIGINT', handleSigint);
		return () => {
			process.off('SIGINT', handleSigint);
		};
	}, [
		tasks.hasRunningTasks,
		tasks.tasks.length,
		keepAlive,
		handleQuitWithCleanup,
		ui,
		commands,
	]);

	// Handle keyboard input when no overlays are active
	useInput((input, key) => {
		if (ui.showScriptSelector || view.showSearch) {
			return;
		}



		commands.handleInput(input, key);
	});

	const { logHeight, splitLogHeight } = useMemo(() => {
		// Root box has top and bottom borders (2 lines)
		let usedHeight = 2;

		if (ui.showScriptSelector || tasks.tasks.length === 0) {
			return { logHeight: Math.max(1, effectiveHeight - usedHeight), splitLogHeight: 0 };
		}

		// TabBar takes 1 line text + 1 paddingBottom + 1 borderBottom = 3
		// Focus mode hides the tab bar entirely (no extra height reserved)
		if (view.displayMode !== 'compact' && !view.focusMode) {
			usedHeight += 3;
		}

		// Calculate bottom Footer/Overlay bounds
		if (ui.pendingConfirmation) {
			// ConfirmDialog footprint: Input(1) + StatusMessage(1) + gap(1) + margin(1) + Footer Box(2) = 6
			usedHeight += 6;
		} else if (view.showSearch) {
			// SearchBar footprint: Input text(1) + gap(1) + Footer Box(2) + padding(1) = 5
			usedHeight += 5;
		} else if (view.showRenameInput) {
			// RenameTabInput footprint: Input text(1) + gap(1) + Footer Box(2) + padding(1) = 5
			usedHeight += 5;
		} else if (!view.focusMode) {
			// Footer standard: marginTop(1) + Status(1) + gap(1) + Border(2) + Text(1) = 6
			// Not rendered in focus mode, so don't reserve the space
			usedHeight += 6;
		} else {
			// Focus mode: no footer, but the "press opt+f to exit" hint text takes 1 line
			usedHeight += 1;
		}

		// Primary Pane log box has borders — not present in compact mode
		if (view.displayMode !== 'compact') {
			usedHeight += 2;
		}

		if (view.splitTaskName && view.displayMode !== 'compact') {
			// Split pane: borders (2) + marginTop (1) + title box text (1) + title marginBottom (1) = 5
			usedHeight += 5;
		}

		const remaining = Math.max(1, effectiveHeight - usedHeight);

		if (view.splitTaskName && view.displayMode !== 'compact') {
			const top = Math.floor(remaining / 2);
			const bottom = remaining - top;
			return { logHeight: top, splitLogHeight: bottom };
		}

		return { logHeight: remaining, splitLogHeight: 0 };
	}, [
		effectiveHeight,
		view.displayMode,
		view.focusMode,
		view.splitTaskName,
		ui.showScriptSelector,
		ui.pendingConfirmation,
		view.showSearch,
		view.showRenameInput,
		tasks.tasks.length,
	]);

	// Get logs for primary task
	const activeLogs = view.activeTask
		? logs.getLogsForTask(
			view.activeTask,
			view.logFilter,
			logHeight,
			view.primaryScrollOffset,
		)
		: [];

	// Calculate scroll info for footer indicator (uses primary pane stats)
	const scrollInfo = view.activeTask
		? {
			startLine: Math.max(
				1,
				view.totalLogs - view.primaryScrollOffset - logHeight + 1,
			),
			endLine: Math.max(0, view.totalLogs - view.primaryScrollOffset),
			totalLogs: view.totalLogs,
			autoScroll: view.primaryAutoScroll,
		}
		: undefined;

	// Show script selector overlay
	if (ui.showScriptSelector) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="cyan"
				width={effectiveWidth}
			>
				<ScriptSelector
					availableScripts={availableScripts}
					runningScripts={tasks.tasks}
					onSelect={handleSelectScript}
					onCancel={handleCancelSelector}
					height={Math.max(1, effectiveHeight - 2)}
				/>
			</Box>
		);
	}

	// Show empty state when no tasks
	if (tasks.tasks.length === 0) {
		return (
			<Box
				flexDirection="column"
				padding={1}
				borderStyle="round"
				borderColor="blue"
				width={effectiveWidth}
			>
				<Box
					flexDirection="column"
					height={Math.max(1, effectiveHeight - 6)}
					justifyContent="center"
					alignItems="center"
				>
					<Text dimColor>No scripts running.</Text>
					<Text dimColor>
						Press <Text bold>n</Text> to add a script.
					</Text>
				</Box>
				{ui.pendingConfirmation ? (
					<ConfirmDialog message={ui.pendingConfirmation.message} />
				) : (
					<Footer
						commands={commands.getVisibleCommands()}
						activeTask={undefined}
						status={undefined}
						logFilter={view.logFilter}
					/>
				)}
			</Box>
		);
	}

	const activeTaskStatus = view.activeTask
		? tasks.getTaskStatus(view.activeTask)
		: undefined;

	const splitTaskStatus = view.splitTaskName
		? tasks.getTaskStatus(view.splitTaskName)
		: undefined;

	const displayActiveTaskName = view.activeTask
		? (tasks.tabAliases?.[view.activeTask] ?? view.activeTask)
		: undefined;

	const displaySplitTaskName = view.splitTaskName
		? (tasks.tabAliases?.[view.splitTaskName] ?? view.splitTaskName)
		: undefined;

	const splitLogs = view.splitTaskName
		? logs.getLogsForTask(view.splitTaskName, view.logFilter)
		: [];

	return (
		<Box
			flexDirection="column"
			paddingX={1}
			borderStyle="round"
			borderColor="blue"
			width={effectiveWidth}
		>
			{!view.focusMode && view.displayMode !== 'compact' ? (
				<TabBar
					tasks={tasks.tasks}
					taskStates={tasks.taskStates}
					pinnedTasks={tasks.pinnedTasks}
					tabAliases={tasks.tabAliases ?? {}}
					activeTabIndex={view.activeTabIndex}
					width={effectiveWidth}
				/>
			) : view.focusMode ? (
				<Box justifyContent="flex-end" width={effectiveWidth - 4}>
					<Text dimColor>[Focus Mode - press {MOD_KEY}+f to exit]</Text>
				</Box>
			) : null}
			{!ui.showHelp && (view.displayMode === 'compact' ? (
				<CompactView
					tasks={tasks.tasks}
					taskStates={tasks.taskStates}
					pinnedTasks={tasks.pinnedTasks}
					tabAliases={tasks.tabAliases ?? {}}
					activeTabIndex={view.activeTabIndex}
					width={effectiveWidth}
					height={Math.min(tasks.tasks.length, logHeight)}
				/>
			) : (
				<Box flexDirection="column" gap={0} flexGrow={1}>
					{/* Primary Pane */}
					<Box
						flexDirection="column"
						flexGrow={1}
						borderStyle="single"
						borderColor={view.activePane === 'primary' ? 'cyan' : 'gray'}
					>
						<LogView
							logs={activeLogs}
							isRunning={activeTaskStatus === 'running'}
							height={logHeight}
							width={effectiveWidth - 2}
							lineOverflow={ui.lineOverflow}
							showTimestamps={view.showTimestamps}
							searchQuery={view.searchQuery}
						/>
					</Box>

					{/* Secondary Split Pane */}
					{view.splitTaskName && (
						<Box
							flexDirection="column"
							flexGrow={1}
							borderStyle="single"
							borderColor={view.activePane === 'split' ? 'cyan' : 'gray'}
							marginTop={1} // Gap between panes
						>
							<Box backgroundColor="gray" paddingX={1} marginBottom={1}>
								<Text color="black" bold>
									{displaySplitTaskName}
								</Text>
							</Box>
							<LogView
								logs={splitLogs}
								isRunning={splitTaskStatus === 'running'}
								height={splitLogHeight}
								width={effectiveWidth - 2}
								lineOverflow={ui.lineOverflow}
								showTimestamps={view.showTimestamps}
								searchQuery={view.searchQuery}
							/>
						</Box>
					)}
				</Box>
			))}

			{ui.showHelp ? (
				<HelpMenu width={effectiveWidth - 4} />
			) : ui.pendingConfirmation ? (
				<ConfirmDialog
					message={ui.pendingConfirmation.message}
					activeTask={displayActiveTaskName}
					status={activeTaskStatus}
				/>
			) : view.showSearch ? (
				<SearchBar
					query={view.searchQuery}
					onQueryChange={view.setSearchQuery}
					matchesCount={view.searchMatches.length}
					currentMatchIndex={view.currentMatchIndex}
					onClose={view.closeSearch}
					onNextMatch={view.nextMatch}
					onPrevMatch={view.prevMatch}
				/>
			) : view.showRenameInput ? (
				<RenameTabInput
					initialName={displayActiveTaskName ?? view.activeTask ?? ''}
					onRename={(newName) => {
						if (view.activeTask) {
							tasks.renameTask(view.activeTask, newName);
						}
					}}
					onClose={view.closeRenameInput}
				/>
			) : !view.focusMode ? (
				<Footer
					commands={commands.getVisibleCommands()}
					activeTask={displayActiveTaskName}
					status={activeTaskStatus}
					logFilter={view.logFilter}
					scrollInfo={scrollInfo}
				/>
			) : null}
		</Box>
	);
};
