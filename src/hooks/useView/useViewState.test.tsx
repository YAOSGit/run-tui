import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useViewState } from './index.js';

const createOptions = (
	overrides: Partial<{
		viewHeight: number;
		tasks: string[];
		pinnedTasks: string[];
		logCounts: Record<string, number>;
	}> = {},
) => ({
	viewHeight: overrides.viewHeight ?? 20,
	tasks: overrides.tasks ?? ['task1', 'task2'],
	pinnedTasks: overrides.pinnedTasks ?? [],
	getLogCountForTask: vi
		.fn()
		.mockImplementation(
			(taskName: string) => overrides.logCounts?.[taskName] ?? 0,
		),
	getLogsForTask: vi.fn().mockReturnValue([]),
	markStderrSeen: vi.fn(),
});

describe('useViewState', () => {
	describe('initial state', () => {
		it('has activeTabIndex 0 initially', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			expect(result.current.activeTabIndex).toBe(0);
		});

		it('has activeTask as first task', () => {
			const { result } = renderHook(() =>
				useViewState(createOptions({ tasks: ['task1', 'task2'] })),
			);

			expect(result.current.activeTask).toBe('task1');
		});

		it('has logFilter null initially', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			expect(result.current.logFilter).toBeNull();
		});

		it('has scrollOffset 0 initially', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			expect(result.current.primaryScrollOffset).toBe(0);
		});

		it('has autoScroll true initially', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			expect(result.current.primaryAutoScroll).toBe(true);
		});

		it('returns provided viewHeight', () => {
			const { result } = renderHook(() =>
				useViewState(createOptions({ viewHeight: 30 })),
			);

			expect(result.current.viewHeight).toBe(30);
		});
	});

	describe('navigateLeft', () => {
		it('decrements activeTabIndex', () => {
			const options = createOptions({ tasks: ['task1', 'task2', 'task3'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.setActiveTabIndex(2);
			});

			act(() => {
				result.current.navigateLeft();
			});

			expect(result.current.activeTabIndex).toBe(1);
		});

		it('wraps to last tab when at first tab', () => {
			const options = createOptions({ tasks: ['task1', 'task2', 'task3'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.navigateLeft();
			});

			expect(result.current.activeTabIndex).toBe(2);
		});

		it('calls markStderrSeen for new tab', () => {
			const options = createOptions({ tasks: ['task1', 'task2'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.setActiveTabIndex(1);
			});

			act(() => {
				result.current.navigateLeft();
			});

			expect(options.markStderrSeen).toHaveBeenCalledWith('task1');
		});
	});

	describe('navigateRight', () => {
		it('increments activeTabIndex', () => {
			const options = createOptions({ tasks: ['task1', 'task2', 'task3'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.navigateRight();
			});

			expect(result.current.activeTabIndex).toBe(1);
		});

		it('wraps to first tab when at last tab', () => {
			const options = createOptions({ tasks: ['task1', 'task2', 'task3'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.setActiveTabIndex(2);
			});

			act(() => {
				result.current.navigateRight();
			});

			expect(result.current.activeTabIndex).toBe(0);
		});

		it('calls markStderrSeen for new tab', () => {
			const options = createOptions({ tasks: ['task1', 'task2'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.navigateRight();
			});

			expect(options.markStderrSeen).toHaveBeenCalledWith('task2');
		});
	});

	describe('setActiveTabIndex', () => {
		it('sets activeTabIndex directly', () => {
			const options = createOptions({ tasks: ['task1', 'task2', 'task3'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.setActiveTabIndex(2);
			});

			expect(result.current.activeTabIndex).toBe(2);
			expect(result.current.activeTask).toBe('task3');
		});

		it('calls markStderrSeen for new tab', () => {
			const options = createOptions({ tasks: ['task1', 'task2'] });
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.setActiveTabIndex(1);
			});

			expect(options.markStderrSeen).toHaveBeenCalledWith('task2');
		});
	});

	describe('cycleLogFilter', () => {
		it('cycles through null -> stdout -> stderr -> null', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			expect(result.current.logFilter).toBeNull();

			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBe('stdout');

			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBe('stderr');

			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBeNull();
		});
	});

	describe('scrollUp', () => {
		it('increments scrollOffset', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
			});

			expect(result.current.primaryScrollOffset).toBe(1);
		});

		it('disables autoScroll', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
			});

			expect(result.current.primaryAutoScroll).toBe(false);
		});

		it('respects max scroll offset', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 15 },
			});
			const { result } = renderHook(() => useViewState(options));

			// Max offset should be totalLogs - viewHeight = 15 - 10 = 5
			for (let i = 0; i < 10; i++) {
				act(() => {
					result.current.scrollUp();
				});
			}

			expect(result.current.primaryScrollOffset).toBe(5);
		});
	});

	describe('scrollDown', () => {
		it('decrements scrollOffset', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
				result.current.scrollUp();
				result.current.scrollUp();
			});

			act(() => {
				result.current.scrollDown();
			});

			expect(result.current.primaryScrollOffset).toBe(2);
		});

		it('does not go below 0', () => {
			const { result } = renderHook(() => useViewState(createOptions()));

			act(() => {
				result.current.scrollDown();
			});

			expect(result.current.primaryScrollOffset).toBe(0);
		});

		it('re-enables autoScroll when reaching bottom', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
			});

			expect(result.current.primaryAutoScroll).toBe(false);

			act(() => {
				result.current.scrollDown();
			});

			expect(result.current.primaryScrollOffset).toBe(0);
			expect(result.current.primaryAutoScroll).toBe(true);
		});
	});

	describe('scrollToBottom', () => {
		it('resets scrollOffset to 0', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
				result.current.scrollUp();
				result.current.scrollUp();
			});

			act(() => {
				result.current.scrollToBottom();
			});

			expect(result.current.primaryScrollOffset).toBe(0);
		});

		it('re-enables autoScroll', () => {
			const options = createOptions({
				viewHeight: 10,
				logCounts: { task1: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			act(() => {
				result.current.scrollUp();
			});

			act(() => {
				result.current.scrollToBottom();
			});

			expect(result.current.primaryAutoScroll).toBe(true);
		});
	});

	describe('totalLogs', () => {
		it('returns log count for active task', () => {
			const options = createOptions({
				tasks: ['task1', 'task2'],
				pinnedTasks: [],
				logCounts: { task1: 25, task2: 50 },
			});
			const { result } = renderHook(() => useViewState(options));

			expect(result.current.totalLogs).toBe(25);
		});

		it('returns 0 when no active task', () => {
			const options = createOptions({ tasks: [] });
			const { result } = renderHook(() => useViewState(options));

			expect(result.current.totalLogs).toBe(0);
		});
	});
});
