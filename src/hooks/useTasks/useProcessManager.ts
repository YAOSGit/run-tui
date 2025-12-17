import { type ChildProcess, spawn } from 'node:child_process';
import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { LogEntry } from '../../types/LogEntry/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import type { PackageManager } from '../../types/PackageManager/index.js';
import { PACKAGE_MANAGER } from '../../types/PackageManager/index.js';
import { SIGNALS } from '../../types/Signals/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

// Utils
const getCommand = (pm: PackageManager): string => {
	if (process.platform === 'win32') {
		return pm === PACKAGE_MANAGER.NPM ? 'npm.cmd' : pm;
	}
	return pm;
};

// biome-ignore lint/suspicious/noControlCharactersInRegex: this is specific for terminal control sequences
const stripControlSequences = (text: string): string => {
	return (
		text
			// Remove clear screen sequences
			.replace(/\x1b\[2J/g, '')
			// Remove cursor home/position sequences
			.replace(/\x1b\[H/g, '')
			.replace(/\x1b\[\d*;\d*H/g, '')
			.replace(/\x1b\[\d*;\d*f/g, '')
			// Remove cursor movement (up, down, forward, back)
			.replace(/\x1b\[\d*[ABCD]/g, '')
			// Remove cursor save/restore
			.replace(/\x1b\[s/g, '')
			.replace(/\x1b\[u/g, '')
			// Remove erase in line/display
			.replace(/\x1b\[K/g, '')
			.replace(/\x1b\[\d*K/g, '')
			.replace(/\x1b\[J/g, '')
			.replace(/\x1b\[\d*J/g, '')
			// Remove scroll sequences
			.replace(/\x1b\[\d*S/g, '')
			.replace(/\x1b\[\d*T/g, '')
			// Remove alternate screen buffer
			.replace(/\x1b\[\?1049[hl]/g, '')
			.replace(/\x1b\[\?47[hl]/g, '')
			// Remove cursor visibility
			.replace(/\x1b\[\?25[hl]/g, '')
			// Remove carriage return that might cause issues
			.replace(/\r/g, '')
	);
};

export interface UseProcessManagerOptions {
	initialTasks: string[];
	packageManager: PackageManager;
	onLogEntry: (entry: LogEntry) => void;
	onTaskStateChange: (taskName: string, updates: Partial<TaskState>) => void;
}

export const useProcessManager = ({
	initialTasks,
	packageManager,
	onLogEntry,
	onTaskStateChange,
}: UseProcessManagerOptions) => {
	// Process management refs
	const childProcesses = useRef<Map<string, ChildProcess>>(new Map());
	const spawnedTasks = useRef<Set<string>>(new Set());
	const killedTasks = useRef<Set<string>>(new Set());

	// Internal: spawn a process for a task
	const spawnProcess = useCallback(
		(taskName: string) => {
			if (spawnedTasks.current.has(taskName)) {
				return;
			}
			spawnedTasks.current.add(taskName);

			onTaskStateChange(taskName, { status: TASK_STATUS.RUNNING });

			const cmd = getCommand(packageManager);

			const child = spawn(cmd, ['run', taskName], {
				env: {
					...process.env,
					FORCE_COLOR: '1',
					npm_config_color: 'always',
				},
				shell: false,
				detached: true,
			});

			childProcesses.current.set(taskName, child);

			const handleData = (
				data: Buffer,
				type: (typeof LOG_TYPE)[keyof typeof LOG_TYPE],
			) => {
				const cleaned = stripControlSequences(data.toString());
				const lines = cleaned.split('\n');
				lines.forEach((line) => {
					if (line.trim() === '') return;
					onLogEntry({
						id: uuidv4(),
						task: taskName,
						text: line,
						type,
						timestamp: new Date().toLocaleTimeString('en-US', {
							hour12: false,
						}),
					});
				});
			};

			child.stdout.on('data', (data) => {
				if (killedTasks.current.has(taskName)) return;
				handleData(data, LOG_TYPE.STDOUT);
			});

			child.stderr.on('data', (data) => {
				if (killedTasks.current.has(taskName)) return;
				handleData(data, LOG_TYPE.STDERR);
				onTaskStateChange(taskName, { hasUnseenStderr: true });
			});

			child.on('close', (code) => {
				const wasKilled = killedTasks.current.has(taskName);
				if (wasKilled) {
					killedTasks.current.delete(taskName);
				}
				onTaskStateChange(taskName, {
					status:
						code === 0 || wasKilled ? TASK_STATUS.SUCCESS : TASK_STATUS.ERROR,
					exitCode: code,
				});
			});

			child.on('error', (err) => {
				onLogEntry({
					id: uuidv4(),
					task: taskName,
					text: `Process error: ${err.message}`,
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
				});
				onTaskStateChange(taskName, {
					status: TASK_STATUS.ERROR,
					exitCode: 1,
				});
			});
		},
		[packageManager, onLogEntry, onTaskStateChange],
	);

	// Kill a specific process
	const killProcess = useCallback(
		(taskName: string, addDivider = true) => {
			const child = childProcesses.current.get(taskName);
			killedTasks.current.add(taskName);
			if (child && !child.killed && child.pid) {
				try {
					process.kill(-child.pid, SIGNALS.SIGTERM);
				} catch {
					child.kill(SIGNALS.SIGTERM);
				}
			}
			if (addDivider) {
				onLogEntry({
					id: uuidv4(),
					task: taskName,
					text: 'Process killed',
					type: LOG_TYPE.DIVIDER,
					timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
				});
			}
			spawnedTasks.current.delete(taskName);
			childProcesses.current.delete(taskName);
		},
		[onLogEntry],
	);

	// Kill all processes
	const killAllProcesses = useCallback(() => {
		childProcesses.current.forEach((child, taskName) => {
			killedTasks.current.add(taskName);
			if (!child.killed && child.pid) {
				try {
					process.kill(-child.pid, SIGNALS.SIGTERM);
				} catch {
					child.kill(SIGNALS.SIGTERM);
				}
			}
		});
		childProcesses.current.clear();
		spawnedTasks.current.clear();
	}, []);

	// Spawn initial tasks on mount
	useEffect(() => {
		initialTasks.forEach((taskName) => {
			spawnProcess(taskName);
		});

		return () => {
			killAllProcesses();
		};
		// Only run on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		spawnProcess,
		killProcess,
		killAllProcesses,
	};
};
