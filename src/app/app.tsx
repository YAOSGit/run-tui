import { Box, type Key, Text, useInput } from 'ink';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog/index.js';
import { Footer } from '../components/Footer/index.js';
import { LogView } from '../components/LogView/index.js';
import { ScriptSelector } from '../components/ScriptSelector/index.js';
import { TabBar } from '../components/TabBar/index.js';
import { useCommands } from '../providers/CommandsProvider/index.js';
import { useLogs } from '../providers/LogsProvider/index.js';
import { useTasks } from '../providers/TasksProvider/index.js';
import { useUIState } from '../providers/UIStateProvider/index.js';
import { useView } from '../providers/ViewProvider/index.js';

export interface AppContentProps {
	availableScripts: string[];
	keepAlive: boolean;
	height: number;
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
			if (ui.showScriptSelector) {
				ui.closeScriptSelector();
				if (tasks.tasks.length === 0 && !keepAlive) {
					handleQuitWithCleanup();
				}
				return;
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

	// Handle keyboard input
	useInput((input, key) => {
		if (ui.showScriptSelector) {
			return;
		}
		commands.handleInput(input, key);
	});

	// Get logs for current task
	const activeLogs = view.activeTask
		? logs.getLogsForTask(
				view.activeTask,
				view.logFilter,
				height,
				view.scrollOffset,
			)
		: [];

	// Calculate scroll info for footer indicator
	const scrollInfo = view.activeTask
		? {
				startLine: Math.max(1, view.totalLogs - view.scrollOffset - height + 1),
				endLine: Math.max(0, view.totalLogs - view.scrollOffset),
				totalLogs: view.totalLogs,
				autoScroll: view.autoScroll,
			}
		: undefined;

	// Show script selector overlay
	if (ui.showScriptSelector) {
		return (
			<Box
				flexDirection="column"
				padding={1}
				borderStyle="round"
				borderColor="cyan"
				width={width}
			>
				<ScriptSelector
					availableScripts={availableScripts}
					runningScripts={tasks.tasks}
					onSelect={handleSelectScript}
					onCancel={handleCancelSelector}
					height={height}
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
				width={width}
			>
				<Box
					flexDirection="column"
					height={height}
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

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="blue"
			width={width}
		>
			<TabBar
				tasks={tasks.tasks}
				taskStates={tasks.taskStates}
				activeTabIndex={view.activeTabIndex}
				width={width}
			/>
			<LogView
				logs={activeLogs}
				isRunning={activeTaskStatus === 'running'}
				height={height}
				width={width}
			/>

			{ui.pendingConfirmation ? (
				<ConfirmDialog
					message={ui.pendingConfirmation.message}
					activeTask={view.activeTask}
					status={activeTaskStatus}
				/>
			) : (
				<Footer
					commands={commands.getVisibleCommands()}
					activeTask={view.activeTask}
					status={activeTaskStatus}
					logFilter={view.logFilter}
					scrollInfo={scrollInfo}
				/>
			)}
		</Box>
	);
};
