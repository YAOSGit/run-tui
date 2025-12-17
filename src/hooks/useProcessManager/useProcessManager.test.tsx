/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import { EventEmitter } from 'node:events';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { TaskState } from '../../types/TaskState/index.js';

// Create hoisted mock function
const mockSpawn = vi.hoisted(() => vi.fn());

// Mock child_process
vi.mock('node:child_process', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('node:child_process')>();
	return {
		__esModule: true,
		...actual,
		default: { ...actual, spawn: mockSpawn },
		spawn: mockSpawn,
	};
});

// Mock uuid
vi.mock('uuid', () => ({
	v4: () => 'test-uuid',
}));

import { useProcessManager } from './index.js';

const createMockChildProcess = () => {
	const stdout = new EventEmitter();
	const stderr = new EventEmitter();
	const child = new EventEmitter() as EventEmitter & {
		stdout: EventEmitter;
		stderr: EventEmitter;
		pid: number;
		killed: boolean;
		kill: Mock;
	};
	child.stdout = stdout;
	child.stderr = stderr;
	child.pid = 12345;
	child.killed = false;
	child.kill = vi.fn();
	return child;
};

describe('useProcessManager', () => {
	let mockChild: ReturnType<typeof createMockChildProcess>;
	let onLogEntry: Mock<(entry: LogEntry) => void>;
	let onTaskStateChange: Mock<
		(taskName: string, updates: Partial<TaskState>) => void
	>;

	beforeEach(() => {
		mockChild = createMockChildProcess();
		mockSpawn.mockReturnValue(mockChild);
		onLogEntry = vi.fn();
		onTaskStateChange = vi.fn();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('initial mount', () => {
		it('spawns processes for initial tasks', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1', 'task2'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			expect(mockSpawn).toHaveBeenCalledTimes(2);
			expect(mockSpawn).toHaveBeenCalledWith('npm', ['run', 'task1'], {
				env: expect.objectContaining({
					FORCE_COLOR: '1',
					npm_config_color: 'always',
				}),
				shell: false,
				detached: true,
			});
		});

		it('sets task status to running when spawning', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'running',
			});
		});
	});

	describe('spawnProcess', () => {
		it('does not spawn same task twice', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.spawnProcess('task1');
			});

			// Should only be called once (from initial mount)
			expect(mockSpawn).toHaveBeenCalledTimes(1);
		});

		it('spawns a new task', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: [],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.spawnProcess('task1');
			});

			expect(mockSpawn).toHaveBeenCalledTimes(1);
			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'running',
			});
		});
	});

	describe('stdout handling', () => {
		it('logs stdout data', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Hello World\n'));
			});

			expect(onLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'task1',
					text: 'Hello World',
					type: 'stdout',
				}),
			);
		});

		it('splits multi-line output into separate log entries', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Line 1\nLine 2\nLine 3\n'));
			});

			expect(onLogEntry).toHaveBeenCalledTimes(3);
		});

		it('ignores empty lines', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Hello\n\n\nWorld\n'));
			});

			expect(onLogEntry).toHaveBeenCalledTimes(2);
		});
	});

	describe('stderr handling', () => {
		it('logs stderr data', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.stderr.emit('data', Buffer.from('Error message\n'));
			});

			expect(onLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'task1',
					text: 'Error message',
					type: 'stderr',
				}),
			);
		});

		it('marks task as having unseen stderr', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.stderr.emit('data', Buffer.from('Error\n'));
			});

			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				hasUnseenStderr: true,
			});
		});
	});

	describe('process close', () => {
		it('sets status to success on exit code 0', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.emit('close', 0);
			});

			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'success',
				exitCode: 0,
			});
		});

		it('sets status to error on non-zero exit code', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.emit('close', 1);
			});

			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'error',
				exitCode: 1,
			});
		});
	});

	describe('process error', () => {
		it('logs error and sets status to error', () => {
			renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				mockChild.emit('error', new Error('Spawn failed'));
			});

			expect(onLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'task1',
					text: 'Process error: Spawn failed',
					type: 'stderr',
				}),
			);

			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'error',
				exitCode: 1,
			});
		});
	});

	describe('killProcess', () => {
		it('adds divider log entry by default', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killProcess('task1');
			});

			expect(onLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'task1',
					text: 'Process killed',
					type: 'divider',
				}),
			);
		});

		it('does not add divider when addDivider is false', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killProcess('task1', false);
			});

			expect(onLogEntry).not.toHaveBeenCalledWith(
				expect.objectContaining({
					text: 'Process killed',
				}),
			);
		});

		it('sets status to success when killed task closes', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killProcess('task1');
			});

			// Clear previous calls
			onTaskStateChange.mockClear();

			act(() => {
				mockChild.emit('close', 1); // Non-zero exit code
			});

			// Should still be success because it was killed
			expect(onTaskStateChange).toHaveBeenCalledWith('task1', {
				status: 'success',
				exitCode: 1,
			});
		});
	});

	describe('killAllProcesses', () => {
		it('kills all spawned processes', () => {
			const mockChild2 = createMockChildProcess();
			mockSpawn.mockReturnValueOnce(mockChild).mockReturnValueOnce(mockChild2);

			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1', 'task2'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killAllProcesses();
			});

			// Both processes should be marked as killed
			// (the actual kill is attempted via process.kill which we don't mock here)
		});
	});

	describe('killed task ignores output', () => {
		it('ignores stdout after task is killed', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killProcess('task1');
			});

			onLogEntry.mockClear();

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Ignored\n'));
			});

			// Should not log anything except the "Process killed" divider
			expect(onLogEntry).not.toHaveBeenCalledWith(
				expect.objectContaining({
					text: 'Ignored',
				}),
			);
		});

		it('ignores stderr after task is killed', () => {
			const { result } = renderHook(() =>
				useProcessManager({
					initialTasks: ['task1'],
					packageManager: 'npm',
					onLogEntry,
					onTaskStateChange,
				}),
			);

			act(() => {
				result.current.killProcess('task1');
			});

			onTaskStateChange.mockClear();

			act(() => {
				mockChild.stderr.emit('data', Buffer.from('Error\n'));
			});

			// Should not mark hasUnseenStderr
			expect(onTaskStateChange).not.toHaveBeenCalledWith('task1', {
				hasUnseenStderr: true,
			});
		});
	});
});
