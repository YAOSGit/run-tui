import { TUILayout, SplitPane } from '@yaos-git/toolkit/tui/components';
import { Box, type Key, Text, useInput, useStdout } from 'ink';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CompactView } from '../components/CompactView/index.js';
import { LogView } from '../components/LogView/index.js';
import { RenameTabInput } from '../components/RenameTabInput/index.js';
import { ScriptSelector } from '../components/ScriptSelector/index.js';
import { SearchBar } from '../components/SearchBar/index.js';
import { TabBar } from '../components/TabBar/index.js';
import {
	COMMANDS,
	useCommands,
} from '../providers/CommandsProvider/index.js';
import {
	SECTION_COLORS,
} from '../providers/CommandsProvider/CommandsProvider.consts.js';
import type { RunTuiDeps } from '../providers/CommandsProvider/CommandsProvider.types.js';
import { useLogs } from '../providers/LogsProvider/index.js';
import { useTasks } from '../providers/TasksProvider/index.js';
import { useUIState } from '../providers/UIStateProvider/index.js';
import { useView } from '../providers/ViewProvider/index.js';
import { theme } from '../theme.js';
import {
	SCROLL_AUTOSCROLL_COLOR,
	SCROLL_PAUSED_COLOR,
	SPLIT_PANE_TITLE_COLOR,
} from './app.consts.js';

export type AppContentProps = {
	availableScripts: string[];
	keepAlive: boolean;
	height?: number;
	width: number;
	onQuit: () => void;
};

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
			view.setActiveTabIndex(tasks.tasks.length - 1);
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

	// Estimate max lines for log data fetching (not layout — flex handles that).
	// AppShell border(2) + header(3) + footer(3) + statusBar(2) + borders/padding(2)
	const CHROME_LINES = 12;
	const maxLines = Math.max(1, effectiveHeight - CHROME_LINES);
	const _splitMaxLines = view.splitTaskName
		? Math.max(1, Math.floor(maxLines / 2) - 2)
		: 0;

	// Get logs for primary task
	const activeLogs = view.activeTask
		? logs.getLogsForTask(
				view.activeTask,
				view.logFilter,
				maxLines,
				view.primaryScrollOffset,
			)
		: [];

	// Calculate scroll info for footer indicator (uses primary pane stats)
	const scrollInfo = view.activeTask
		? {
				startLine: Math.max(
					1,
					view.totalLogs - view.primaryScrollOffset - maxLines + 1,
				),
				endLine: Math.max(0, view.totalLogs - view.primaryScrollOffset),
				totalLogs: view.totalLogs,
				autoScroll: view.primaryAutoScroll,
			}
		: undefined;

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

	// Build scroll indicator for status bar
	const scrollIndicator = scrollInfo && scrollInfo.totalLogs > 0 && (
		<Text dimColor>
			{scrollInfo.startLine}-{scrollInfo.endLine}/{scrollInfo.totalLogs}
			{scrollInfo.autoScroll ? (
				<Text color={SCROLL_AUTOSCROLL_COLOR}> ▶</Text>
			) : (
				<Text color={SCROLL_PAUSED_COLOR}> ⏸</Text>
			)}
		</Text>
	);

	// Build status bar (task name + status + filter + scroll)
	const statusBar =
		displayActiveTaskName && activeTaskStatus ? (
			<Box justifyContent="space-between">
				<Box>
					<Text bold>{displayActiveTaskName}</Text>
					<Text dimColor> - {activeTaskStatus.toUpperCase()}</Text>
					<Text dimColor> [{view.logFilter ?? 'all'}]</Text>
				</Box>
				{scrollIndicator}
			</Box>
		) : undefined;

	// Build header (TabBar or compact summary)
	const displayActiveTask = view.activeTask
		? (tasks.tabAliases?.[view.activeTask] ?? view.activeTask)
		: null;

	const header =
		tasks.tasks.length > 0 ? (
			view.displayMode === 'compact' ? (
				<Box width="100%" borderStyle="round" borderColor="gray" paddingX={1}>
					<Text wrap="truncate">
						<Text bold color={theme.brand}>Compact</Text>
						<Text dimColor> › </Text>
						<Text>{tasks.tasks.length} tasks</Text>
						{displayActiveTask && (
							<>
								<Text dimColor> › </Text>
								<Text bold>{displayActiveTask}</Text>
							</>
						)}
					</Text>
				</Box>
			) : (
				<TabBar
					tasks={tasks.tasks}
					taskStates={tasks.taskStates}
					pinnedTasks={tasks.pinnedTasks}
					tabAliases={tasks.tabAliases ?? {}}
					activeTabIndex={view.activeTabIndex}
					width={effectiveWidth}
				/>
			)
		) : null;

	// Build overlays map for TUILayout
	const overlays: Record<string, () => React.ReactNode> = useMemo(
		() => ({
			selector: () => (
				<ScriptSelector
					availableScripts={availableScripts}
					runningScripts={tasks.tasks}
					onSelect={handleSelectScript}
					onCancel={handleCancelSelector}
					height={Math.max(1, effectiveHeight - 2)}
				/>
			),
			search: () => (
				<SearchBar
					query={view.searchQuery}
					onQueryChange={view.setSearchQuery}
					matchesCount={view.searchMatches.length}
					currentMatchIndex={view.currentMatchIndex}
					onClose={view.closeSearch}
					onNextMatch={view.nextMatch}
					onPrevMatch={view.prevMatch}
				/>
			),
			rename: () => (
				<RenameTabInput
					initialName={displayActiveTaskName ?? view.activeTask ?? ''}
					onRename={(newName) => {
						if (view.activeTask) {
							tasks.renameTask(view.activeTask, newName);
						}
					}}
					onClose={view.closeRenameInput}
				/>
			),
		}),
		[
			availableScripts,
			tasks.tasks,
			handleSelectScript,
			handleCancelSelector,
			effectiveHeight,
			view.searchQuery,
			view.setSearchQuery,
			view.searchMatches.length,
			view.currentMatchIndex,
			view.closeSearch,
			view.nextMatch,
			view.prevMatch,
			displayActiveTaskName,
			view.activeTask,
			tasks.renameTask,
			view.closeRenameInput,
		],
	);

	// Build main content
	const mainContent = useMemo(() => {
		// Empty state when no tasks and no overlay active
		if (tasks.tasks.length === 0) {
			return (
				<Box
					flexDirection="column"
					flexGrow={1}
					justifyContent="center"
					alignItems="center"
				>
					<Text dimColor>No scripts running.</Text>
					<Text dimColor>
						Press <Text bold>n</Text> to add a script.
					</Text>
				</Box>
			);
		}

		// Compact view mode
		if (view.displayMode === 'compact') {
			return (
				<CompactView
					tasks={tasks.tasks}
					taskStates={tasks.taskStates}
					pinnedTasks={tasks.pinnedTasks}
					tabAliases={tasks.tabAliases ?? {}}
					activeTabIndex={view.activeTabIndex}
					maxVisible={Math.min(tasks.tasks.length, maxLines)}
				/>
			);
		}

		// Normal/split view with SplitPane
		if (view.splitTaskName) {
			return (
				<SplitPane
					direction="vertical"
					ratio={[50, 50]}
					focusedIndex={view.activePane === 'primary' ? 0 : 1}
					theme={theme}
					borders={[true, true]}
				>
					<LogView
						logs={activeLogs}
						isRunning={activeTaskStatus === 'running'}
						width={effectiveWidth - 2}
						lineOverflow={ui.lineOverflow}
						showTimestamps={view.showTimestamps}
						searchQuery={view.searchQuery}
					/>
					<Box flexDirection="column" flexGrow={1}>
						<Box backgroundColor="gray" paddingX={1} marginBottom={1}>
							<Text color={SPLIT_PANE_TITLE_COLOR} bold>
								{displaySplitTaskName}
							</Text>
						</Box>
						<LogView
							logs={splitLogs}
							isRunning={splitTaskStatus === 'running'}
							width={effectiveWidth - 2}
							lineOverflow={ui.lineOverflow}
							showTimestamps={view.showTimestamps}
							searchQuery={view.searchQuery}
						/>
					</Box>
				</SplitPane>
			);
		}

		// Single pane
		return (
			<SplitPane
				direction="vertical"
				ratio={[100, 0]}
				focusedIndex={0}
				theme={theme}
				borders={[true, false]}
			>
				<LogView
					logs={activeLogs}
					isRunning={activeTaskStatus === 'running'}
					width={effectiveWidth - 2}
					lineOverflow={ui.lineOverflow}
					showTimestamps={view.showTimestamps}
					searchQuery={view.searchQuery}
				/>
			</SplitPane>
		);
	}, [
		tasks.tasks,
		tasks.taskStates,
		tasks.pinnedTasks,
		tasks.tabAliases,
		view.displayMode,
		view.splitTaskName,
		view.activePane,
		view.activeTabIndex,
		view.showTimestamps,
		view.searchQuery,
		activeLogs,
		splitLogs,
		activeTaskStatus,
		splitTaskStatus,
		effectiveWidth,
		ui.lineOverflow,
		displaySplitTaskName,
		maxLines,
	]);

	return (
		<TUILayout<RunTuiDeps>
			brand="run"
			theme={theme}
			commands={COMMANDS}
			deps={commands.deps}
			helpTitle="YAOSGit run - Keyboard Shortcuts"
			helpSectionColors={SECTION_COLORS}
			overlays={overlays}
			header={header}
			statusBar={statusBar}
			footerChildren={null}
		>
			{mainContent}
		</TUILayout>
	);
};
