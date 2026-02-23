import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLogs } from './index.js';

const makeEntry = (task: string, text: string, i: number) => ({
	id: `${i}`,
	task,
	text,
	type: 'stdout' as const,
	timestamp: '00:00:00',
});

describe('useLogs — stress & edge case tests', () => {
	describe('High volume logging', () => {
		it('handles 2000 logs efficiently and enforces per-task cap', () => {
			const { result } = renderHook(() => useLogs());
			const start = performance.now();

			act(() => {
				for (let i = 0; i < 2000; i++) {
					result.current.addLog(makeEntry('flood', `Line ${i}`, i));
				}
			});

			const duration = performance.now() - start;
			expect(duration).toBeLessThan(2000); // Should complete in <2s

			const logs = result.current.getLogsForTask('flood', null);
			// Per-task cap is MAX_LOGS_PER_TASK (1000)
			expect(logs.length).toBeLessThanOrEqual(1000);
			// Most recent logs are retained
			expect(logs[logs.length - 1].text).toBe('Line 1999');
		});

		it('enforces per-task limit independently for multiple tasks', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 1500; i++) {
					result.current.addLog(makeEntry('task1', `t1-${i}`, i));
					result.current.addLog(makeEntry('task2', `t2-${i}`, i + 10000));
				}
			});

			const task1 = result.current.getLogsForTask('task1', null);
			const task2 = result.current.getLogsForTask('task2', null);
			expect(task1.length).toBeLessThanOrEqual(1000);
			expect(task2.length).toBeLessThanOrEqual(1000);
			// Tasks are independent — task2 logs are not affected by task1's cap
			expect(task2[task2.length - 1].text).toBe('t2-1499');
		});

		it('getLogsForTask returns empty array for unknown task', () => {
			const { result } = renderHook(() => useLogs());
			expect(result.current.getLogsForTask('nonexistent', null)).toEqual([]);
		});

		it('getLogCountForTask is consistent with getLogsForTask length', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				for (let i = 0; i < 50; i++) {
					result.current.addLog(makeEntry('task1', `stdout-${i}`, i));
				}
				for (let i = 0; i < 20; i++) {
					result.current.addLog(makeEntry('task1', `stderr-${i}`, i + 1000));
				}
				(
					result.current.addLog as unknown as ReturnType<
						typeof useLogs
					>['addLog']
				)({
					id: `d`,
					task: 'task1',
					text: '---',
					type: 'divider',
					timestamp: '00:00:00',
				});
			});

			const allLogs = result.current.getLogsForTask('task1', null);
			const count = result.current.getLogCountForTask('task1', null);
			expect(count).toBe(allLogs.length);
		});
	});

	describe('Malformed / edge case data', () => {
		it('handles log entries with empty text', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog({
					id: '1',
					task: 'task1',
					text: '',
					type: 'stdout',
					timestamp: '00:00:00',
				});
			});

			const logs = result.current.getLogsForTask('task1', null);
			expect(logs).toHaveLength(1);
			expect(logs[0].text).toBe('');
		});

		it('clearLogsForTask on unknown task does not throw', () => {
			const { result } = renderHook(() => useLogs());
			expect(() => {
				act(() => {
					result.current.clearLogsForTask('nonexistent');
				});
			}).not.toThrow();
		});

		it('clearLogsForTask leaves other tasks intact', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(makeEntry('a', 'log-a', 1));
				result.current.addLog(makeEntry('b', 'log-b', 2));
				result.current.clearLogsForTask('a');
			});

			expect(result.current.getLogsForTask('a', null)).toHaveLength(0);
			expect(result.current.getLogsForTask('b', null)).toHaveLength(1);
		});

		it('handles adding logs after clearing', () => {
			const { result } = renderHook(() => useLogs());

			act(() => {
				result.current.addLog(makeEntry('task1', 'before', 1));
				result.current.clearLogsForTask('task1');
				result.current.addLog(makeEntry('task1', 'after', 2));
			});

			const logs = result.current.getLogsForTask('task1', null);
			expect(logs).toHaveLength(1);
			expect(logs[0].text).toBe('after');
		});
	});
});
