import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTasksState } from './index.js';

describe('useTasksState', () => {
	describe('initial state', () => {
		it('initializes with provided tasks', () => {
			const { result } = renderHook(() => useTasksState(['task1', 'task2']));

			expect(result.current.tasks).toEqual(['task1', 'task2']);
		});

		it('initializes task states with pending status', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			expect(result.current.taskStates.task1).toEqual({
				name: 'task1',
				status: 'pending',
				exitCode: null,
				hasUnseenStderr: false,
			});
		});

		it('has hasRunningTasks false initially', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			expect(result.current.hasRunningTasks).toBe(false);
		});
	});

	describe('updateTaskState', () => {
		it('updates task state partially', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			act(() => {
				result.current.updateTaskState('task1', { status: 'running' });
			});

			expect(result.current.taskStates.task1.status).toBe('running');
			expect(result.current.taskStates.task1.exitCode).toBeNull();
		});

		it('updates multiple properties', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			act(() => {
				result.current.updateTaskState('task1', {
					status: 'success',
					exitCode: 0,
				});
			});

			expect(result.current.taskStates.task1.status).toBe('success');
			expect(result.current.taskStates.task1.exitCode).toBe(0);
		});
	});

	describe('addTaskState', () => {
		it('adds a new task to tasks array', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			act(() => {
				result.current.addTaskState('task2');
			});

			expect(result.current.tasks).toEqual(['task1', 'task2']);
		});

		it('initializes new task with pending state', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			act(() => {
				result.current.addTaskState('task2');
			});

			expect(result.current.taskStates.task2).toEqual({
				name: 'task2',
				status: 'pending',
				exitCode: null,
				hasUnseenStderr: false,
			});
		});
	});

	describe('removeTaskState', () => {
		it('removes task from tasks array', () => {
			const { result } = renderHook(() => useTasksState(['task1', 'task2']));

			act(() => {
				result.current.removeTaskState('task1');
			});

			expect(result.current.tasks).toEqual(['task2']);
		});

		it('removes task state', () => {
			const { result } = renderHook(() => useTasksState(['task1', 'task2']));

			act(() => {
				result.current.removeTaskState('task1');
			});

			expect(result.current.taskStates.task1).toBeUndefined();
			expect(result.current.taskStates.task2).toBeDefined();
		});
	});

	describe('markStderrSeen', () => {
		it('sets hasUnseenStderr to false', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			act(() => {
				result.current.updateTaskState('task1', { hasUnseenStderr: true });
			});

			expect(result.current.taskStates.task1.hasUnseenStderr).toBe(true);

			act(() => {
				result.current.markStderrSeen('task1');
			});

			expect(result.current.taskStates.task1.hasUnseenStderr).toBe(false);
		});
	});

	describe('getTaskStatus', () => {
		it('returns task status', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			expect(result.current.getTaskStatus('task1')).toBe('pending');

			act(() => {
				result.current.updateTaskState('task1', { status: 'running' });
			});

			expect(result.current.getTaskStatus('task1')).toBe('running');
		});

		it('returns undefined for unknown task', () => {
			const { result } = renderHook(() => useTasksState(['task1']));

			expect(result.current.getTaskStatus('unknown')).toBeUndefined();
		});
	});

	describe('hasRunningTasks', () => {
		it('returns true when any task is running', () => {
			const { result } = renderHook(() => useTasksState(['task1', 'task2']));

			act(() => {
				result.current.updateTaskState('task1', { status: 'running' });
			});

			expect(result.current.hasRunningTasks).toBe(true);
		});

		it('returns false when no tasks are running', () => {
			const { result } = renderHook(() => useTasksState(['task1', 'task2']));

			act(() => {
				result.current.updateTaskState('task1', { status: 'success' });
				result.current.updateTaskState('task2', { status: 'error' });
			});

			expect(result.current.hasRunningTasks).toBe(false);
		});
	});
});
