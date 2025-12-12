import { Box, useApp, useInput } from 'ink';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useLogs } from '../../hooks/useLogs/index.js';
import { useProcessManager } from '../../hooks/useProcessManager/index.js';
import { useTaskStates } from '../../hooks/useTaskStates/index.js';
import type { LogType } from '../../types/LogType/index.js';
import { Footer } from '../Footer/index.js';
import { LogView } from '../LogView/index.js';
import { QuitConfirm } from '../QuitConfirm/index.js';
import { TabBar } from '../TabBar/index.js';
import { KEY_COMMANDS, LOG_FILTERS, VISIBLE_LOGS } from './App.consts.js';
import type { AppProps } from './App.types.js';
import { isKeyCommand } from './App.utils.js';

const App: React.FC<AppProps> = ({ tasks, packageManager }) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [showQuitConfirm, setShowQuitConfirm] = useState(false);
	const [logFilter, setLogFilter] = useState<LogType | null>(LOG_FILTERS[0]);
	const { exit } = useApp();

	const activeTask = tasks[activeTabIndex];
	const { taskStates, updateTaskState, markStderrSeen } = useTaskStates(tasks);
	const { addLog, getLogsForTask } = useLogs();

	const { killProcess, killAllProcesses } = useProcessManager({
		tasks,
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

	useEffect(() => {
		const handleSigint = () => {
			if (hasRunningTasks) {
				setShowQuitConfirm(true);
			} else {
				handleQuit();
			}
		};

		process.on('SIGINT', handleSigint);
		return () => {
			process.off('SIGINT', handleSigint);
		};
	}, [hasRunningTasks, handleQuit]);

	useInput((input, key) => {
		if (showQuitConfirm) {
			if (isKeyCommand(key, input, KEY_COMMANDS.CONFIRM_QUIT_YES)) {
				handleQuit();
			} else if (isKeyCommand(key, input, KEY_COMMANDS.CONFIRM_QUIT_NO)) {
				setShowQuitConfirm(false);
			}
		}

		if (isKeyCommand(key, input, KEY_COMMANDS.QUIT)) {
			if (hasRunningTasks) {
				setShowQuitConfirm(true);
			} else {
				handleQuit();
			}
		}
		if (isKeyCommand(key, input, KEY_COMMANDS.KILL)) {
			killProcess(activeTask);
		}
		if (isKeyCommand(key, input, KEY_COMMANDS.FILTER)) {
			setLogFilter((prev) => {
				const currentIndex = LOG_FILTERS.indexOf(prev);
				return LOG_FILTERS[(currentIndex + 1) % LOG_FILTERS.length];
			});
		}
		if (isKeyCommand(key, input, KEY_COMMANDS.LEFT_ARROW)) {
			setActiveTabIndex((prev) => {
				const newIndex = prev === 0 ? tasks.length - 1 : prev - 1;
				markStderrSeen(tasks[newIndex]);
				return newIndex;
			});
		}
		if (isKeyCommand(key, input, KEY_COMMANDS.RIGHT_ARROW)) {
			setActiveTabIndex((prev) => {
				const newIndex = prev === tasks.length - 1 ? 0 : prev + 1;
				markStderrSeen(tasks[newIndex]);
				return newIndex;
			});
		}
	});

	const activeLogs = getLogsForTask(activeTask, logFilter, VISIBLE_LOGS);
	const runningCount = Object.values(taskStates).filter(
		(t) => t.status === 'running',
	).length;

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="blue"
		>
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				activeTabIndex={activeTabIndex}
			/>
			<LogView
				logs={activeLogs}
				isRunning={taskStates[activeTask]?.status === 'running'}
			/>

			{showQuitConfirm ? (
				<QuitConfirm runningCount={runningCount} />
			) : (
				<Footer
					activeTask={activeTask}
					status={taskStates[activeTask]?.status}
					logFilter={logFilter}
				/>
			)}
		</Box>
	);
};

export default App;
