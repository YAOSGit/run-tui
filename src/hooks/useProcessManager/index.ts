import { type ChildProcess, spawn } from 'node:child_process';
import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { LogType } from '../../types/LogType/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { SIGNALS } from '../../types/Signals/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import type { UseProcessManagerOptions } from './useProcessManager.types.js';
import {
	getCommand,
	stripControlSequences,
} from './useProcessManager.utils.js';

export const useProcessManager = ({
	tasks,
	packageManager,
	onLogEntry,
	onTaskStateChange,
}: UseProcessManagerOptions) => {
	const childProcesses = useRef<Map<string, ChildProcess>>(new Map());

	const killProcess = useCallback((taskName: string) => {
		const child = childProcesses.current.get(taskName);
		if (child && !child.killed && child.pid) {
			try {
				process.kill(-child.pid, SIGNALS.SIGTERM);
			} catch {
				child.kill(SIGNALS.SIGTERM);
			}
		}
	}, []);

	const killAllProcesses = useCallback(() => {
		childProcesses.current.forEach((child) => {
			if (!child.killed && child.pid) {
				try {
					process.kill(-child.pid, SIGNALS.SIGTERM);
				} catch {
					child.kill(SIGNALS.SIGTERM);
				}
			}
		});
		childProcesses.current.clear();
	}, []);

	useEffect(() => {
		tasks.forEach((taskName) => {
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

			const handleData = (data: Buffer, type: LogType) => {
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

			child.stdout.on('data', (data) => handleData(data, LOG_TYPE.STDOUT));
			child.stderr.on('data', (data) => {
				handleData(data, LOG_TYPE.STDERR);
				onTaskStateChange(taskName, { hasUnseenStderr: true });
			});

			child.on('close', (code) => {
				onTaskStateChange(taskName, {
					status: code === 0 ? TASK_STATUS.SUCCESS : TASK_STATUS.ERROR,
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
		});

		return () => {
			killAllProcesses();
		};
	}, [packageManager, onLogEntry, onTaskStateChange, tasks, killAllProcesses]);

	return {
		killProcess,
		killAllProcesses,
	};
};
