import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { useTaskStates } from './index.js';

describe('useTaskStates', () => {
	const tasks = ['build', 'test', 'lint'];

	it('initializes task states with pending status', () => {
		const { result } = renderHook(() => useTaskStates(tasks));

		expect(result.current.taskStates).toEqual({
			build: {
				name: 'build',
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			},
			test: {
				name: 'test',
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			},
			lint: {
				name: 'lint',
				status: TASK_STATUS.PENDING,
				exitCode: null,
				hasUnseenStderr: false,
			},
		});
	});

	it('updates task state with partial updates', () => {
		const { result } = renderHook(() => useTaskStates(tasks));

		act(() => {
			result.current.updateTaskState('build', { status: TASK_STATUS.RUNNING });
		});

		expect(result.current.taskStates.build.status).toBe(TASK_STATUS.RUNNING);
		expect(result.current.taskStates.build.exitCode).toBeNull();
	});

	it('marks stderr as seen', () => {
		const { result } = renderHook(() => useTaskStates(tasks));

		act(() => {
			result.current.updateTaskState('build', { hasUnseenStderr: true });
		});

		expect(result.current.taskStates.build.hasUnseenStderr).toBe(true);

		act(() => {
			result.current.markStderrSeen('build');
		});

		expect(result.current.taskStates.build.hasUnseenStderr).toBe(false);
	});
});
