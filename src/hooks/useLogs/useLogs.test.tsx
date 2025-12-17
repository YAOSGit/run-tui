import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { useLogs } from './index.js';
import { MAX_LOGS } from './useLogs.consts.js';

describe('useLogs', () => {
	const createLogEntry = (
		id: string,
		task: string,
		text: string,
		type: 'stdout' | 'stderr' = 'stdout',
	) => ({
		id,
		task,
		text,
		type,
		timestamp: '12:00:00',
	});

	it('initializes with empty logs', () => {
		const { result } = renderHook(() => useLogs());

		expect(result.current.logs).toEqual([]);
	});

	it('adds a log entry', () => {
		const { result } = renderHook(() => useLogs());
		const entry = createLogEntry('1', 'build', 'Building...');

		act(() => {
			result.current.addLog(entry);
		});

		expect(result.current.logs).toHaveLength(1);
		expect(result.current.logs[0]).toEqual(entry);
	});

	it('adds multiple log entries', () => {
		const { result } = renderHook(() => useLogs());
		const entry1 = createLogEntry('1', 'build', 'Building...');
		const entry2 = createLogEntry('2', 'build', 'Done!');

		act(() => {
			result.current.addLog(entry1);
			result.current.addLog(entry2);
		});

		expect(result.current.logs).toHaveLength(2);
		expect(result.current.logs[0]).toEqual(entry1);
		expect(result.current.logs[1]).toEqual(entry2);
	});

	it('enforces MAX_LOGS limit', () => {
		const { result } = renderHook(() => useLogs());

		act(() => {
			for (let i = 0; i < MAX_LOGS + 10; i++) {
				result.current.addLog(createLogEntry(String(i), 'build', `Log ${i}`));
			}
		});

		expect(result.current.logs).toHaveLength(MAX_LOGS);
		expect(result.current.logs[0].text).toBe(`Log 10`);
		expect(result.current.logs[MAX_LOGS - 1].text).toBe(`Log ${MAX_LOGS + 9}`);
	});

	describe('getLogsForTask', () => {
		it('filters logs by task name', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('1', 'build', 'Build log'));
				result.current.addLog(createLogEntry('2', 'test', 'Test log'));
				result.current.addLog(
					createLogEntry('3', 'build', 'Another build log'),
				);
			});

			const buildLogs = result.current.getLogsForTask('build');
			expect(buildLogs).toHaveLength(2);
			expect(buildLogs[0].text).toBe('Build log');
			expect(buildLogs[1].text).toBe('Another build log');
		});

		it('filters logs by type', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(
					createLogEntry('1', 'build', 'stdout log', LOG_TYPE.STDOUT),
				);
				result.current.addLog(
					createLogEntry('2', 'build', 'stderr log', LOG_TYPE.STDERR),
				);
				result.current.addLog(
					createLogEntry('3', 'build', 'another stdout', LOG_TYPE.STDOUT),
				);
			});

			const stdoutLogs = result.current.getLogsForTask(
				'build',
				LOG_TYPE.STDOUT,
			);
			expect(stdoutLogs).toHaveLength(2);

			const stderrLogs = result.current.getLogsForTask(
				'build',
				LOG_TYPE.STDERR,
			);
			expect(stderrLogs).toHaveLength(1);
			expect(stderrLogs[0].text).toBe('stderr log');
		});

		it('returns all log types when filter is null', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(
					createLogEntry('1', 'build', 'stdout log', LOG_TYPE.STDOUT),
				);
				result.current.addLog(
					createLogEntry('2', 'build', 'stderr log', LOG_TYPE.STDERR),
				);
			});

			const allLogs = result.current.getLogsForTask('build', null);
			expect(allLogs).toHaveLength(2);
		});

		it('limits the number of returned logs', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.addLog(createLogEntry(String(i), 'build', `Log ${i}`));
				}
			});

			const limitedLogs = result.current.getLogsForTask('build', null, 5);
			expect(limitedLogs).toHaveLength(5);
			expect(limitedLogs[0].text).toBe('Log 5');
			expect(limitedLogs[4].text).toBe('Log 9');
		});

		it('returns empty array for non-existent task', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('1', 'build', 'Build log'));
			});

			const logs = result.current.getLogsForTask('nonexistent');
			expect(logs).toEqual([]);
		});

		it('applies scrollOffset to return earlier logs', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.addLog(createLogEntry(String(i), 'build', `Log ${i}`));
				}
			});

			// With limit 5 and scrollOffset 3, should get logs 2-6 (indices)
			const scrolledLogs = result.current.getLogsForTask('build', null, 5, 3);
			expect(scrolledLogs).toHaveLength(5);
			expect(scrolledLogs[0].text).toBe('Log 2');
			expect(scrolledLogs[4].text).toBe('Log 6');
		});

		it('handles scrollOffset at top boundary', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.addLog(createLogEntry(String(i), 'build', `Log ${i}`));
				}
			});

			// With limit 5 and scrollOffset 7, should get logs 0-2 (only 3 logs available at top)
			const scrolledLogs = result.current.getLogsForTask('build', null, 5, 7);
			expect(scrolledLogs).toHaveLength(3);
			expect(scrolledLogs[0].text).toBe('Log 0');
			expect(scrolledLogs[2].text).toBe('Log 2');
		});
	});

	describe('getLogCountForTask', () => {
		it('returns count of logs for a task', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('1', 'build', 'Build log 1'));
				result.current.addLog(createLogEntry('2', 'test', 'Test log'));
				result.current.addLog(createLogEntry('3', 'build', 'Build log 2'));
			});

			expect(result.current.getLogCountForTask('build')).toBe(2);
			expect(result.current.getLogCountForTask('test')).toBe(1);
		});

		it('returns count filtered by log type', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(
					createLogEntry('1', 'build', 'stdout 1', LOG_TYPE.STDOUT),
				);
				result.current.addLog(
					createLogEntry('2', 'build', 'stderr 1', LOG_TYPE.STDERR),
				);
				result.current.addLog(
					createLogEntry('3', 'build', 'stdout 2', LOG_TYPE.STDOUT),
				);
			});

			expect(result.current.getLogCountForTask('build', LOG_TYPE.STDOUT)).toBe(
				2,
			);
			expect(result.current.getLogCountForTask('build', LOG_TYPE.STDERR)).toBe(
				1,
			);
		});

		it('returns 0 for non-existent task', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(createLogEntry('1', 'build', 'Build log'));
			});

			expect(result.current.getLogCountForTask('nonexistent')).toBe(0);
		});
	});
});
