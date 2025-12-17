import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLogs } from './index.js';

const createLogEntry = (
	task: string,
	type: 'stdout' | 'stderr' | 'divider',
	text: string,
) => ({
	id: crypto.randomUUID(),
	task,
	type,
	text,
	timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
});

describe('useLogs', () => {
	describe('addLog', () => {
		it('adds a log entry', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'Hello'));
			});

			const logs = result.current.getLogsForTask('task1');
			expect(logs).toHaveLength(1);
			expect(logs[0].text).toBe('Hello');
			expect(logs[0].task).toBe('task1');
			expect(logs[0].type).toBe('stdout');
		});

		it('adds multiple log entries', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'Line 1'));
				result.current.addLog(createLogEntry('task1', 'stderr', 'Error'));
			});

			const logs = result.current.getLogsForTask('task1');
			expect(logs).toHaveLength(2);
		});

		it('limits logs to MAX_LOGS (1000)', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 1050; i++) {
					result.current.addLog(createLogEntry('task1', 'stdout', `Line ${i}`));
				}
			});

			const logs = result.current.getLogsForTask('task1');
			expect(logs).toHaveLength(1000);
			expect(logs[0].text).toBe('Line 50');
			expect(logs[999].text).toBe('Line 1049');
		});
	});

	describe('getLogsForTask', () => {
		it('returns only logs for the specified task', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'Task 1'));
				result.current.addLog(createLogEntry('task2', 'stdout', 'Task 2'));
			});

			const task1Logs = result.current.getLogsForTask('task1');
			expect(task1Logs).toHaveLength(1);
			expect(task1Logs[0].text).toBe('Task 1');

			const task2Logs = result.current.getLogsForTask('task2');
			expect(task2Logs).toHaveLength(1);
			expect(task2Logs[0].text).toBe('Task 2');
		});

		it('filters by log type when specified', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(
					createLogEntry('task1', 'stdout', 'stdout message'),
				);
				result.current.addLog(
					createLogEntry('task1', 'stderr', 'stderr message'),
				);
			});

			const stdoutLogs = result.current.getLogsForTask('task1', 'stdout');
			expect(stdoutLogs).toHaveLength(1);
			expect(stdoutLogs[0].text).toBe('stdout message');

			const stderrLogs = result.current.getLogsForTask('task1', 'stderr');
			expect(stderrLogs).toHaveLength(1);
			expect(stderrLogs[0].text).toBe('stderr message');
		});

		it('returns all logs when filter is null', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'stdout'));
				result.current.addLog(createLogEntry('task1', 'stderr', 'stderr'));
			});

			const allLogs = result.current.getLogsForTask('task1', null);
			expect(allLogs).toHaveLength(2);
		});

		it('respects limit parameter', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.addLog(createLogEntry('task1', 'stdout', `Line ${i}`));
				}
			});

			const limitedLogs = result.current.getLogsForTask('task1', null, 5);
			expect(limitedLogs).toHaveLength(5);
			expect(limitedLogs[0].text).toBe('Line 5');
			expect(limitedLogs[4].text).toBe('Line 9');
		});

		it('respects scrollOffset parameter', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.addLog(createLogEntry('task1', 'stdout', `Line ${i}`));
				}
			});

			// scrollOffset of 2 means we've scrolled up 2 lines from the bottom
			const scrolledLogs = result.current.getLogsForTask('task1', null, 5, 2);
			expect(scrolledLogs).toHaveLength(5);
			expect(scrolledLogs[0].text).toBe('Line 3');
			expect(scrolledLogs[4].text).toBe('Line 7');
		});
	});

	describe('getLogCountForTask', () => {
		it('returns the count of logs for a task', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'Line 1'));
				result.current.addLog(createLogEntry('task1', 'stdout', 'Line 2'));
			});

			expect(result.current.getLogCountForTask('task1')).toBe(2);
		});

		it('returns 0 for unknown task', () => {
			const { result } = renderHook(() => useLogs());

			expect(result.current.getLogCountForTask('unknown')).toBe(0);
		});

		it('filters by log type when specified', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'stdout 1'));
				result.current.addLog(createLogEntry('task1', 'stdout', 'stdout 2'));
				result.current.addLog(createLogEntry('task1', 'stderr', 'stderr 1'));
			});

			expect(result.current.getLogCountForTask('task1', 'stdout')).toBe(2);
			expect(result.current.getLogCountForTask('task1', 'stderr')).toBe(1);
			expect(result.current.getLogCountForTask('task1', null)).toBe(3);
		});
	});

	describe('clearLogsForTask', () => {
		it('clears logs for the specified task only', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('task1', 'stdout', 'Task 1'));
				result.current.addLog(createLogEntry('task2', 'stdout', 'Task 2'));
			});

			act(() => {
				result.current.clearLogsForTask('task1');
			});

			expect(result.current.getLogsForTask('task1')).toHaveLength(0);
			expect(result.current.getLogsForTask('task2')).toHaveLength(1);
		});
	});
});
