import { type ChildProcess, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { useCallback, useEffect, useRef } from 'react';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { SIGNALS } from '../../types/Signals/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { KILL_TIMEOUT_MS } from './useProcessManager.consts.js';
import type { UseProcessManagerOptions } from './useProcessManager.types.js';
import {
	getCommand,
	stripControlSequences,
} from './useProcessManager.utils.js';

export const useProcessManager = ({
	initialTasks,
	packageManager,
	restartConfig,
	scriptArgs,
	onLogEntry,
	onTaskStateChange,
}: UseProcessManagerOptions) => {
	// Process management refs
	const childProcesses = useRef<Map<string, ChildProcess>>(new Map());
	const spawnedTasks = useRef<Set<string>>(new Set());
	const killedTasks = useRef<Set<string>>(new Set());
	const taskTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
	const restartCounts = useRef<Map<string, number>>(new Map());
	// Capture initialTasks in a ref so the startup effect has exhaustive deps
	const initialTasksRef = useRef(initialTasks);

	// Clear restart timer for a specific task
	const clearRestartTimer = useCallback((taskName: string) => {
		const timerId = taskTimers.current.get(taskName);
		if (timerId) {
			clearTimeout(timerId);
			taskTimers.current.delete(taskName);
		}
	}, []);

	// Reset restart count for a specific task
	const resetRestartCount = useCallback((taskName: string) => {
		restartCounts.current.delete(taskName);
	}, []);

	// Internal: spawn a process for a task
	const spawnProcess = useCallback(
		(taskName: string) => {
			if (spawnedTasks.current.has(taskName)) {
				return;
			}
			spawnedTasks.current.add(taskName);

			onTaskStateChange(taskName, {
				status: TASK_STATUS.RUNNING,
				startedAt: Date.now(),
				endedAt: null,
			});

			const cmd = getCommand(packageManager);

			// Strip any trailing instance suffix, e.g., 'dev (2)' -> 'dev'
			const scriptName = taskName.replace(/\s\(\d+\)$/, '');

			const args = ['run', scriptName];
			if (scriptArgs && scriptArgs.length > 0) {
				if (packageManager === 'npm') {
					args.push('--');
				}
				args.push(...scriptArgs);
			}

			const child = spawn(cmd, args, {
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
						id: randomUUID(),
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

			const handleTaskFailure = (exitCode: number, _errorMsg?: string) => {
				const { enabled, exitCodes, delayMs, maxAttempts } = restartConfig;

				if (!enabled) {
					onTaskStateChange(taskName, {
						status: TASK_STATUS.ERROR,
						exitCode,
						endedAt: Date.now(),
					});
					return;
				}

				if (exitCodes && !exitCodes.includes(exitCode)) {
					onLogEntry({
						id: randomUUID(),
						task: taskName,
						text: `Exit code ${exitCode} not in restartable codes. Giving up.`,
						type: LOG_TYPE.STDERR,
						timestamp: new Date().toLocaleTimeString('en-US', {
							hour12: false,
						}),
					});
					onTaskStateChange(taskName, {
						status: TASK_STATUS.ERROR,
						exitCode,
						endedAt: Date.now(),
					});
					return;
				}

				const currentCount = restartCounts.current.get(taskName) ?? 0;
				if (currentCount >= maxAttempts) {
					onLogEntry({
						id: randomUUID(),
						task: taskName,
						text: `Maximum restart attempts (${maxAttempts}) reached. Giving up.`,
						type: LOG_TYPE.STDERR,
						timestamp: new Date().toLocaleTimeString('en-US', {
							hour12: false,
						}),
					});
					onTaskStateChange(taskName, {
						status: TASK_STATUS.ERROR,
						exitCode,
						endedAt: Date.now(),
					});
					return;
				}

				const nextCount = currentCount + 1;
				restartCounts.current.set(taskName, nextCount);

				// Inform state we are about to restart
				onTaskStateChange(taskName, {
					status: TASK_STATUS.RESTARTING,
					exitCode,
					restartCount: nextCount,
					endedAt: Date.now(),
				});

				const timer = setTimeout(() => {
					taskTimers.current.delete(taskName);
					spawnProcess(taskName);
				}, delayMs);

				taskTimers.current.set(taskName, timer);
			};

			child.on('close', (code) => {
				const wasKilled = killedTasks.current.has(taskName);
				if (wasKilled) {
					killedTasks.current.delete(taskName);
					onTaskStateChange(taskName, {
						status: TASK_STATUS.SUCCESS,
						exitCode: code,
						endedAt: Date.now(),
					});
					return;
				}

				if (code === 0) {
					onTaskStateChange(taskName, {
						status: TASK_STATUS.SUCCESS,
						exitCode: code,
						endedAt: Date.now(),
					});
				} else {
					// Remove the child from our maps so it can be respawned smoothly later
					spawnedTasks.current.delete(taskName);
					childProcesses.current.delete(taskName);
					handleTaskFailure(code ?? 1);
				}
			});

			child.on('error', (err) => {
				onLogEntry({
					id: randomUUID(),
					task: taskName,
					text: `Process error: ${err.message}`,
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
				});
				spawnedTasks.current.delete(taskName);
				childProcesses.current.delete(taskName);
				handleTaskFailure(1, err.message);
			});
		},
		[packageManager, onLogEntry, onTaskStateChange, restartConfig, scriptArgs],
	);

	const killProcess = useCallback(
		(taskName: string, addDivider = true) => {
			clearRestartTimer(taskName);

			const child = childProcesses.current.get(taskName);
			if (child && !child.killed && child.pid) {
				const pid = child.pid;
				let killed = false;
				try {
					process.kill(-pid, SIGNALS.SIGTERM);
					killed = true;
				} catch {
					// Process group kill failed — try direct kill
					try {
						child.kill(SIGNALS.SIGTERM);
						killed = true;
					} catch (directError) {
						onLogEntry({
							id: randomUUID(),
							task: taskName,
							text: `Failed to kill process: ${(directError as Error).message}`,
							type: LOG_TYPE.STDERR,
							timestamp: new Date().toLocaleTimeString('en-US', {
								hour12: false,
							}),
						});
					}
				}
				if (killed) {
					killedTasks.current.add(taskName);

					// Escalate to SIGKILL if the process hasn't exited in time
					const escalation = setTimeout(() => {
						if (!child.killed) {
							try {
								process.kill(-pid, SIGNALS.SIGKILL);
							} catch {
								try {
									child.kill(SIGNALS.SIGKILL);
								} catch {
									/* already dead */
								}
							}
							onLogEntry({
								id: randomUUID(),
								task: taskName,
								text: 'Process did not respond to SIGTERM — sent SIGKILL',
								type: LOG_TYPE.STDERR,
								timestamp: new Date().toLocaleTimeString('en-US', {
									hour12: false,
								}),
							});
						}
					}, KILL_TIMEOUT_MS);

					// Cancel escalation if process exits gracefully before timeout
					child.once('exit', () => clearTimeout(escalation));
				}
			}
			if (addDivider) {
				onLogEntry({
					id: randomUUID(),
					task: taskName,
					text: 'Process killed',
					type: LOG_TYPE.DIVIDER,
					timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
				});
			}
			spawnedTasks.current.delete(taskName);
			childProcesses.current.delete(taskName);
			restartCounts.current.delete(taskName);
		},
		[onLogEntry, clearRestartTimer],
	);

	// Kill all tracking and processes
	const killAllProcesses = useCallback(() => {
		for (const timer of taskTimers.current.values()) {
			clearTimeout(timer);
		}
		taskTimers.current.clear();
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
		restartCounts.current.clear();
	}, []);

	// Spawn initial tasks once on mount, clean up on unmount
	useEffect(() => {
		initialTasksRef.current.forEach((taskName) => {
			spawnProcess(taskName);
		});

		return () => {
			killAllProcesses();
		};
	}, [spawnProcess, killAllProcesses]);

	return {
		clearRestartTimer,
		resetRestartCount,
		spawnProcess,
		killProcess,
		killAllProcesses,
	};
};
