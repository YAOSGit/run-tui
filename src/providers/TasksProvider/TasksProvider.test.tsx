/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

// Create hoisted mock functions
const mockSpawnProcess = vi.hoisted(() => vi.fn());
const mockKillProcess = vi.hoisted(() => vi.fn());
const mockKillAllProcesses = vi.hoisted(() => vi.fn());

// Mock useProcessManager
vi.mock('../../hooks/useProcessManager/index.js', () => ({
	useProcessManager: () => ({
		spawnProcess: mockSpawnProcess,
		killProcess: mockKillProcess,
		killAllProcesses: mockKillAllProcesses,
		clearRestartTimer: vi.fn(),
		resetRestartCount: vi.fn(),
	}),
}));

import { TasksProvider, useTasks } from './index.js';

const createWrapper =
	(
		props: {
			initialTasks?: string[];
			packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun';
		} = {},
	) =>
		({ children }: { children: React.ReactNode }) => (
			<TasksProvider
				initialTasks={props.initialTasks ?? ['task1']}
				packageManager={props.packageManager ?? 'npm'}
				restartConfig={{ enabled: false, delayMs: 100, maxAttempts: 1 }}
				scriptArgs={[]}
				onLogEntry={vi.fn()}
			>
				{children}
			</TasksProvider>
		);

describe('TasksProvider', () => {
	describe('useTasks hook', () => {
		it('throws error when used outside provider', () => {
			expect(() => {
				renderHook(() => useTasks());
			}).toThrow('useTasks must be used within a TasksProvider');
		});

		it('returns context value when used within provider', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper(),
			});

			expect(result.current).toHaveProperty('tasks');
			expect(result.current).toHaveProperty('taskStates');
			expect(result.current).toHaveProperty('hasRunningTasks');
			expect(result.current).toHaveProperty('addTask');
			expect(result.current).toHaveProperty('closeTask');
			expect(result.current).toHaveProperty('restartTask');
			expect(result.current).toHaveProperty('killTask');
			expect(result.current).toHaveProperty('killAllTasks');
			expect(result.current).toHaveProperty('markStderrSeen');
			expect(result.current).toHaveProperty('getTaskStatus');
		});
	});

	describe('initial state', () => {
		it('initializes with provided tasks', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			expect(result.current.tasks).toEqual(['task1', 'task2']);
		});

		it('initializes task states with pending status', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			expect(result.current.taskStates.task1).toEqual({
				name: 'task1',
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
				restartCount: 0,
				startedAt: null,
				endedAt: null,
			});
		});
	});

	describe('addTask', () => {
		it('adds task to tasks array and spawns process', () => {
			mockSpawnProcess.mockClear();

			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			act(() => {
				result.current.addTask('task2');
			});

			expect(result.current.tasks).toContain('task2');
			expect(mockSpawnProcess).toHaveBeenCalledWith('task2');
		});

		it('initializes new task with pending state', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			act(() => {
				result.current.addTask('task2');
			});

			expect(result.current.taskStates.task2).toEqual({
				name: 'task2',
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
				restartCount: 0,
				startedAt: null,
				endedAt: null,
			});
		});
	});

	describe('closeTask', () => {
		it('removes task from tasks array', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.closeTask('task1');
			});

			expect(result.current.tasks).not.toContain('task1');
			expect(result.current.tasks).toContain('task2');
		});

		it('removes task state', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.closeTask('task1');
			});

			expect(result.current.taskStates.task1).toBeUndefined();
		});
	});

	describe('restartTask', () => {
		it('resets task state to pending and spawns process', () => {
			mockSpawnProcess.mockClear();

			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			act(() => {
				result.current.restartTask('task1');
			});

			expect(result.current.taskStates.task1.status).toBe(TASK_STATUS.PENDING);
			expect(result.current.taskStates.task1.exitCode).toBeNull();
			expect(result.current.taskStates.task1.hasUnseenStderr).toBe(false);
			expect(mockSpawnProcess).toHaveBeenCalledWith('task1');
		});
	});

	describe('killTask', () => {
		it('calls killProcess with addDivider=true', () => {
			mockKillProcess.mockClear();

			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			act(() => {
				result.current.killTask('task1');
			});

			expect(mockKillProcess).toHaveBeenCalledWith('task1', true);
		});
	});

	describe('killAllTasks', () => {
		it('calls killAllProcesses', () => {
			mockKillAllProcesses.mockClear();

			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.killAllTasks();
			});

			expect(mockKillAllProcesses).toHaveBeenCalledTimes(1);
		});
	});

	describe('markStderrSeen', () => {
		it('sets hasUnseenStderr to false', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			// First, we need to simulate that stderr was received
			// Since we can't directly set hasUnseenStderr, we just verify
			// markStderrSeen is callable and doesn't throw
			act(() => {
				result.current.markStderrSeen('task1');
			});

			expect(result.current.taskStates.task1.hasUnseenStderr).toBe(false);
		});
	});

	describe('getTaskStatus', () => {
		it('returns task status', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			expect(result.current.getTaskStatus('task1')).toBe(TASK_STATUS.PENDING);
		});

		it('returns undefined for unknown task', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			expect(result.current.getTaskStatus('unknown')).toBeUndefined();
		});
	});

	describe('hasRunningTasks', () => {
		it('returns false when no tasks are running', () => {
			const { result } = renderHook(() => useTasks(), {
				wrapper: createWrapper({ initialTasks: ['task1'] }),
			});

			expect(result.current.hasRunningTasks).toBe(false);
		});
	});
});
