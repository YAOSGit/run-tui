import { act, renderHook } from '@testing-library/react';
import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { useProcessManager } from './index.js';

// Create a mock ChildProcess class
class MockChildProcess extends EventEmitter {
	stdout = new EventEmitter();
	stderr = new EventEmitter();
	pid = 12345;
	killed = false;

	kill(signal?: string) {
		this.killed = true;
		this.emit('close', signal === 'SIGTERM' ? null : 0);
	}
}

// Use vi.hoisted to create a mock that can be referenced in the hoisted vi.mock
const { mockSpawn } = vi.hoisted(() => ({
	mockSpawn: vi.fn(),
}));

vi.mock('node:child_process', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('node:child_process')>();
	return {
		...actual,
		default: {
			...actual,
			spawn: mockSpawn,
		},
		spawn: mockSpawn,
	};
});

// Mock uuid to return predictable values
let uuidCounter = 0;
vi.mock('uuid', () => ({
	v4: () => `uuid-${++uuidCounter}`,
}));

describe('useProcessManager', () => {
	let mockChild: MockChildProcess;
	const mockOnLogEntry = vi.fn();
	const mockOnTaskStateChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		uuidCounter = 0;
		mockChild = new MockChildProcess();
		mockSpawn.mockReturnValue(mockChild);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	const defaultOptions = {
		tasks: ['build'],
		packageManager: 'npm' as const,
		onLogEntry: mockOnLogEntry,
		onTaskStateChange: mockOnTaskStateChange,
	};

	describe('spawnTask', () => {
		it('spawns a task and sets status to running', () => {
			renderHook(() => useProcessManager(defaultOptions));

			expect(mockSpawn).toHaveBeenCalledWith('npm', ['run', 'build'], {
				env: expect.objectContaining({
					FORCE_COLOR: '1',
					npm_config_color: 'always',
				}),
				shell: false,
				detached: true,
			});

			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.RUNNING,
			});
		});

		it('spawns multiple tasks on mount', () => {
			const options = {
				...defaultOptions,
				tasks: ['build', 'test', 'lint'],
			};

			renderHook(() => useProcessManager(options));

			expect(mockSpawn).toHaveBeenCalledTimes(3);
			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.RUNNING,
			});
			expect(mockOnTaskStateChange).toHaveBeenCalledWith('test', {
				status: TASK_STATUS.RUNNING,
			});
			expect(mockOnTaskStateChange).toHaveBeenCalledWith('lint', {
				status: TASK_STATUS.RUNNING,
			});
		});

		it('does not spawn the same task twice', () => {
			const { result } = renderHook(() => useProcessManager(defaultOptions));

			// Task already spawned on mount
			expect(mockSpawn).toHaveBeenCalledTimes(1);

			// Try to spawn again
			act(() => {
				result.current.spawnTask('build');
			});

			// Should still be only 1 call
			expect(mockSpawn).toHaveBeenCalledTimes(1);
		});

		it('uses correct command for different package managers', () => {
			const options = {
				...defaultOptions,
				packageManager: 'yarn' as const,
			};

			renderHook(() => useProcessManager(options));

			expect(mockSpawn).toHaveBeenCalledWith(
				'yarn',
				['run', 'build'],
				expect.any(Object),
			);
		});
	});

	describe('stdout handling', () => {
		it('logs stdout data with correct type', async () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Build started'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'build',
					text: 'Build started',
					type: LOG_TYPE.STDOUT,
				}),
			);
		});

		it('splits multiline output into separate log entries', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Line 1\nLine 2\nLine 3'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledTimes(3);
			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({ text: 'Line 1' }),
			);
			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({ text: 'Line 2' }),
			);
			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({ text: 'Line 3' }),
			);
		});

		it('ignores empty lines', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Line 1\n\n\nLine 2'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledTimes(2);
		});

		it('strips control sequences from output', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stdout.emit('data', Buffer.from('\x1b[2JClean output'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({ text: 'Clean output' }),
			);
		});
	});

	describe('stderr handling', () => {
		it('logs stderr data with correct type', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stderr.emit('data', Buffer.from('Error occurred'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'build',
					text: 'Error occurred',
					type: LOG_TYPE.STDERR,
				}),
			);
		});

		it('marks task as having unseen stderr', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.stderr.emit('data', Buffer.from('Warning message'));
			});

			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				hasUnseenStderr: true,
			});
		});
	});

	describe('process close', () => {
		it('sets status to success when exit code is 0', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.emit('close', 0);
			});

			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.SUCCESS,
				exitCode: 0,
			});
		});

		it('sets status to error when exit code is non-zero', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.emit('close', 1);
			});

			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.ERROR,
				exitCode: 1,
			});
		});
	});

	describe('process error', () => {
		it('logs error and sets status to error', () => {
			renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				mockChild.emit('error', new Error('spawn failed'));
			});

			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'build',
					text: 'Process error: spawn failed',
					type: LOG_TYPE.STDERR,
				}),
			);

			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.ERROR,
				exitCode: 1,
			});
		});
	});

	describe('killProcess', () => {
		it('kills a running process and logs divider', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				result.current.killProcess('build');
			});

			expect(mockProcessKill).toHaveBeenCalledWith(-12345, 'SIGTERM');

			expect(mockOnLogEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					task: 'build',
					text: 'Process killed',
					type: LOG_TYPE.DIVIDER,
				}),
			);

			mockProcessKill.mockRestore();
		});

		it('marks killed process as success on close', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			// Kill the process
			act(() => {
				result.current.killProcess('build');
			});

			// Clear previous calls to isolate the close event
			mockOnTaskStateChange.mockClear();

			// Emit close event (simulating the process being killed)
			act(() => {
				mockChild.emit('close', 137); // SIGKILL exit code
			});

			// Should be marked as success, not error, because it was intentionally killed
			expect(mockOnTaskStateChange).toHaveBeenCalledWith('build', {
				status: TASK_STATUS.SUCCESS,
				exitCode: 137,
			});

			mockProcessKill.mockRestore();
		});

		it('allows task to be respawned after killing', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			expect(mockSpawn).toHaveBeenCalledTimes(1);

			act(() => {
				result.current.killProcess('build');
			});

			// Create new mock child for respawn
			const newMockChild = new MockChildProcess();
			mockSpawn.mockReturnValue(newMockChild);

			act(() => {
				result.current.spawnTask('build');
			});

			expect(mockSpawn).toHaveBeenCalledTimes(2);

			mockProcessKill.mockRestore();
		});

		it('suppresses stdout after kill', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				result.current.killProcess('build');
			});

			mockOnLogEntry.mockClear();

			// Emit stdout after kill - should be ignored
			act(() => {
				mockChild.stdout.emit('data', Buffer.from('Should be ignored'));
			});

			// Only the divider log should have been called, not this stdout
			expect(mockOnLogEntry).not.toHaveBeenCalledWith(
				expect.objectContaining({ text: 'Should be ignored' }),
			);

			mockProcessKill.mockRestore();
		});

		it('suppresses stderr after kill', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				result.current.killProcess('build');
			});

			mockOnLogEntry.mockClear();
			mockOnTaskStateChange.mockClear();

			// Emit stderr after kill - should be ignored
			act(() => {
				mockChild.stderr.emit('data', Buffer.from('ELIFECYCLE error'));
			});

			expect(mockOnLogEntry).not.toHaveBeenCalledWith(
				expect.objectContaining({ text: 'ELIFECYCLE error' }),
			);
			expect(mockOnTaskStateChange).not.toHaveBeenCalledWith('build', {
				hasUnseenStderr: true,
			});

			mockProcessKill.mockRestore();
		});

		it('falls back to child.kill when process.kill fails', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => {
				throw new Error('EPERM');
			});
			const childKillSpy = vi.spyOn(mockChild, 'kill');

			const { result } = renderHook(() => useProcessManager(defaultOptions));

			act(() => {
				result.current.killProcess('build');
			});

			expect(childKillSpy).toHaveBeenCalledWith('SIGTERM');

			mockProcessKill.mockRestore();
		});
	});

	describe('killAllProcesses', () => {
		it('kills all running processes', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const mockChildren = [
				new MockChildProcess(),
				new MockChildProcess(),
				new MockChildProcess(),
			];
			mockChildren[0].pid = 111;
			mockChildren[1].pid = 222;
			mockChildren[2].pid = 333;

			let childIndex = 0;
			mockSpawn.mockImplementation(() => mockChildren[childIndex++]);

			const options = {
				...defaultOptions,
				tasks: ['build', 'test', 'lint'],
			};

			const { result } = renderHook(() => useProcessManager(options));

			act(() => {
				result.current.killAllProcesses();
			});

			expect(mockProcessKill).toHaveBeenCalledWith(-111, 'SIGTERM');
			expect(mockProcessKill).toHaveBeenCalledWith(-222, 'SIGTERM');
			expect(mockProcessKill).toHaveBeenCalledWith(-333, 'SIGTERM');

			mockProcessKill.mockRestore();
		});
	});

	describe('cleanup on unmount', () => {
		it('kills all processes when component unmounts', () => {
			const mockProcessKill = vi.spyOn(process, 'kill').mockImplementation(() => true);

			const { unmount } = renderHook(() => useProcessManager(defaultOptions));

			unmount();

			expect(mockProcessKill).toHaveBeenCalledWith(-12345, 'SIGTERM');

			mockProcessKill.mockRestore();
		});
	});

	describe('return values', () => {
		it('returns spawnTask, killProcess, and killAllProcesses functions', () => {
			const { result } = renderHook(() => useProcessManager(defaultOptions));

			expect(typeof result.current.spawnTask).toBe('function');
			expect(typeof result.current.killProcess).toBe('function');
			expect(typeof result.current.killAllProcesses).toBe('function');
		});
	});
});
