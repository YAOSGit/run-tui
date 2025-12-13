import { Box, type Key, Text, useApp, useInput, useStdout } from 'ink';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommandRegistry } from '../../hooks/useCommandRegistry/index.js';
import { useLogs } from '../../hooks/useLogs/index.js';
import { useProcessManager } from '../../hooks/useProcessManager/index.js';
import { useTaskStates } from '../../hooks/useTaskStates/index.js';
import type { CommandContext } from '../../types/CommandContext/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { ConfirmDialog } from '../ConfirmDialog/index.js';
import { Footer } from '../Footer/index.js';
import { LogView } from '../LogView/index.js';
import { ScriptSelector } from '../ScriptSelector/index.js';
import { TabBar } from '../TabBar/index.js';
import type { AppProps } from './App.types.js';

const App: React.FC<AppProps> = ({
	tasks: initialTasks,
	packageManager,
	availableScripts,
	keepAlive,
	height,
}) => {
	const { stdout } = useStdout();
	const width = stdout?.columns ?? 80;
	const [runningTasks, setRunningTasks] = useState<string[]>(initialTasks);
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [showScriptSelector, setShowScriptSelector] = useState(
		initialTasks.length === 0 && keepAlive,
	);
	const [logFilter, setLogFilter] = useState<LogType | null>(null);
	const { exit } = useApp();

	const activeTask = runningTasks[activeTabIndex];
	const { taskStates, updateTaskState, markStderrSeen, addTask, removeTask } =
		useTaskStates(initialTasks);
	const { addLog, getLogsForTask } = useLogs();

	const { spawnTask, killProcess, killAllProcesses } = useProcessManager({
		tasks: initialTasks,
		packageManager,
		onLogEntry: addLog,
		onTaskStateChange: updateTaskState,
	});

	const hasRunningTasks = Object.values(taskStates).some(
		(t) => t.status === 'running',
	);

	const handleQuit = useCallback(() => {
		killAllProcesses();
		exit();
		setTimeout(() => process.exit(0), 100);
	}, [killAllProcesses, exit]);

	const handleSelectScript = useCallback(
		(script: string) => {
			addTask(script);
			setRunningTasks((prev) => [...prev, script]);
			spawnTask(script);
			setActiveTabIndex(runningTasks.length);
			setShowScriptSelector(false);
		},
		[addTask, spawnTask, runningTasks.length],
	);

	const handleCancelSelector = useCallback(() => {
		if (runningTasks.length === 0 && !keepAlive) {
			handleQuit();
		} else {
			setShowScriptSelector(false);
		}
	}, [runningTasks.length, keepAlive, handleQuit]);

	// Build command context
	const commandContext: CommandContext = useMemo(
		() => ({
			activeTask,
			taskStatus: taskStates[activeTask]?.status,
			runningTasks,
			hasRunningTasks,
			keepAlive,
			showScriptSelector,
			logFilter,
			killProcess,
			spawnTask,
			handleQuit,
			setShowScriptSelector,
			setLogFilter,
			removeTask,
			setRunningTasks,
			setActiveTabIndex,
			markStderrSeen,
		}),
		[
			activeTask,
			taskStates,
			runningTasks,
			hasRunningTasks,
			keepAlive,
			showScriptSelector,
			logFilter,
			killProcess,
			spawnTask,
			handleQuit,
			removeTask,
			markStderrSeen,
		],
	);

	const { handleInput, getVisibleCommands, pendingConfirmation } =
		useCommandRegistry(commandContext);

	// Handle SIGINT
	useEffect(() => {
		const handleSigint = () => {
			if (showScriptSelector) {
				setShowScriptSelector(false);
				if (runningTasks.length === 0 && !keepAlive) {
					handleQuit();
				}
				return;
			}
			if (hasRunningTasks || keepAlive) {
				handleInput('q', {
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
				handleQuit();
			}
		};

		process.on('SIGINT', handleSigint);
		return () => {
			process.off('SIGINT', handleSigint);
		};
	}, [
		hasRunningTasks,
		handleQuit,
		showScriptSelector,
		runningTasks.length,
		keepAlive,
		handleInput,
	]);

	useInput((input, key) => {
		if (showScriptSelector) {
			return;
		}

		handleInput(input, key);
	});

	const activeLogs = activeTask
		? getLogsForTask(activeTask, logFilter, height)
		: [];

	// Show script selector overlay
	if (showScriptSelector) {
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
					runningScripts={runningTasks}
					onSelect={handleSelectScript}
					onCancel={handleCancelSelector}
					height={height}
				/>
			</Box>
		);
	}

	// Show empty state when no tasks
	if (runningTasks.length === 0) {
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
				{pendingConfirmation ? (
					<ConfirmDialog message={pendingConfirmation.message} />
				) : (
					<Footer
						commands={getVisibleCommands()}
						activeTask={undefined}
						status={undefined}
						logFilter={logFilter}
					/>
				)}
			</Box>
		);
	}

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="blue"
			width={width}
		>
			<TabBar
				tasks={runningTasks}
				taskStates={taskStates}
				activeTabIndex={activeTabIndex}
				width={width}
			/>
			<LogView
				logs={activeLogs}
				isRunning={taskStates[activeTask]?.status === 'running'}
				height={height}
				width={width}
			/>

			{pendingConfirmation ? (
				<ConfirmDialog
					message={pendingConfirmation.message}
					activeTask={activeTask}
					status={taskStates[activeTask]?.status}
				/>
			) : (
				<Footer
					commands={getVisibleCommands()}
					activeTask={activeTask}
					status={taskStates[activeTask]?.status}
					logFilter={logFilter}
				/>
			)}
		</Box>
	);
};

export default App;
