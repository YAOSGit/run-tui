/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { LogsProvider, useLogs } from './index.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<LogsProvider>{children}</LogsProvider>
);

describe('LogsProvider', () => {
	describe('useLogs hook', () => {
		it('throws error when used outside provider', () => {
			expect(() => {
				renderHook(() => useLogs());
			}).toThrow('useLogs must be used within a LogsProvider');
		});

		it('returns context value when used within provider', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			expect(result.current).toHaveProperty('addLog');
			expect(result.current).toHaveProperty('getLogsForTask');
			expect(result.current).toHaveProperty('getLogCountForTask');
			expect(result.current).toHaveProperty('clearLogsForTask');
		});
	});

	describe('addLog', () => {
		it('adds log entries that can be retrieved', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'Hello World',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});
			});

			const logs = result.current.getLogsForTask('task1', null);
			expect(logs).toHaveLength(1);
			expect(logs[0].text).toBe('Hello World');
		});
	});

	describe('getLogsForTask', () => {
		it('returns empty array for task with no logs', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			const logs = result.current.getLogsForTask('nonexistent', null);
			expect(logs).toEqual([]);
		});

		it('filters logs by type when filter is provided', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'stdout message',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});

				result.current.addLog({
					id: '2',
					task: 'task1',
					text: 'stderr message',
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toISOString(),
				});
			});

			const stdoutLogs = result.current.getLogsForTask(
				'task1',
				LOG_TYPE.STDOUT,
			);
			expect(stdoutLogs).toHaveLength(1);
			expect(stdoutLogs[0].text).toBe('stdout message');

			const stderrLogs = result.current.getLogsForTask(
				'task1',
				LOG_TYPE.STDERR,
			);
			expect(stderrLogs).toHaveLength(1);
			expect(stderrLogs[0].text).toBe('stderr message');
		});

		it('returns all logs when filter is null', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'stdout',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});

				result.current.addLog({
					id: '2',
					task: 'task1',
					text: 'stderr',
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toISOString(),
				});
			});

			const allLogs = result.current.getLogsForTask('task1', null);
			expect(allLogs).toHaveLength(2);
		});
	});

	describe('getLogCountForTask', () => {
		it('returns 0 for task with no logs', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			expect(result.current.getLogCountForTask('nonexistent', null)).toBe(0);
		});

		it('returns correct count for all logs', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'log1',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});

				result.current.addLog({
					id: '2',
					task: 'task1',
					text: 'log2',
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toISOString(),
				});
			});

			expect(result.current.getLogCountForTask('task1', null)).toBe(2);
		});

		it('returns filtered count when filter is provided', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'stdout',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});

				result.current.addLog({
					id: '2',
					task: 'task1',
					text: 'stderr',
					type: LOG_TYPE.STDERR,
					timestamp: new Date().toISOString(),
				});
			});

			expect(result.current.getLogCountForTask('task1', LOG_TYPE.STDOUT)).toBe(
				1,
			);
			expect(result.current.getLogCountForTask('task1', LOG_TYPE.STDERR)).toBe(
				1,
			);
		});
	});

	describe('clearLogsForTask', () => {
		it('removes all logs for a specific task', () => {
			const { result } = renderHook(() => useLogs(), { wrapper });

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: 'log1',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});

				result.current.addLog({
					id: '2',
					task: 'task2',
					text: 'log2',
					type: LOG_TYPE.STDOUT,
					timestamp: new Date().toISOString(),
				});
			});

			act(() => {
				result.current.clearLogsForTask('task1');
			});

			expect(result.current.getLogCountForTask('task1', null)).toBe(0);
			expect(result.current.getLogCountForTask('task2', null)).toBe(1);
		});
	});
});
