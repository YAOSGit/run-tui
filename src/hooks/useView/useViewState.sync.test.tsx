import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useViewState } from './index.js';

const makeOptions = (
	tasks: string[],
	logCounts: Record<string, number> = {},
) => ({
	viewHeight: 20,
	tasks,
	pinnedTasks: [],
	getLogCountForTask: (task: string) => logCounts[task] ?? 0,
	getLogsForTask: vi.fn().mockReturnValue([]),
	markStderrSeen: vi.fn(),
});

describe('useViewState — state synchronization', () => {
	describe('View updates when tasks change', () => {
		it('resets activeTabIndex to 0 when all tasks are removed', () => {
			const { result, rerender } = renderHook(
				({ tasks }) => useViewState(makeOptions(tasks)),
				{ initialProps: { tasks: ['task1', 'task2', 'task3'] } },
			);

			// Navigate to tab 2
			act(() => {
				result.current.navigateRight();
				result.current.navigateRight();
			});
			expect(result.current.activeTabIndex).toBe(2);

			// Remove all tasks
			rerender({ tasks: [] });
			expect(result.current.activeTabIndex).toBe(0);
		});

		it('clamps activeTabIndex when tasks are removed', () => {
			const { result, rerender } = renderHook(
				({ tasks }) => useViewState(makeOptions(tasks)),
				{ initialProps: { tasks: ['task1', 'task2', 'task3'] } },
			);

			// Navigate to last tab
			act(() => {
				result.current.navigateRight();
				result.current.navigateRight();
			});
			expect(result.current.activeTabIndex).toBe(2);

			// Remove one task (tab index 2 is now out of bounds)
			rerender({ tasks: ['task1', 'task2'] });
			expect(result.current.activeTabIndex).toBe(1);
		});

		it('activeTask reflects the task at activeTabIndex', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['build', 'test', 'lint'])),
			);

			expect(result.current.activeTask).toBe('build');

			act(() => {
				result.current.navigateRight();
			});
			expect(result.current.activeTask).toBe('test');
		});

		it('activeTask is undefined when tasks is empty', () => {
			const { result } = renderHook(() => useViewState(makeOptions([])));
			expect(result.current.activeTask).toBeUndefined();
		});
	});

	describe('Scroll state resets on tab/filter change', () => {
		it('resets scrollOffset and re-enables autoScroll on tab switch', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['task1', 'task2'], { task1: 100 })),
			);

			// Scroll up
			act(() => {
				result.current.scrollUp();
				result.current.scrollUp();
			});
			expect(result.current.primaryScrollOffset).toBeGreaterThan(0);
			expect(result.current.primaryAutoScroll).toBe(false);

			// Switch tabs — scroll should reset
			act(() => {
				result.current.navigateRight();
			});
			expect(result.current.primaryScrollOffset).toBe(0);
			expect(result.current.primaryAutoScroll).toBe(true);
		});

		it('re-enables autoScroll when scrollDown reaches bottom', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['task1'], { task1: 100 })),
			);

			// Scroll up first
			act(() => {
				result.current.scrollUp();
				result.current.scrollUp();
			});
			expect(result.current.primaryAutoScroll).toBe(false);

			// Scroll down to 0
			act(() => {
				result.current.scrollToBottom();
			});
			expect(result.current.primaryAutoScroll).toBe(true);
			expect(result.current.primaryScrollOffset).toBe(0);
		});
	});

	describe('Navigation wraps correctly', () => {
		it('navigateLeft wraps from first to last tab', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['task1', 'task2', 'task3'])),
			);

			act(() => {
				result.current.navigateLeft();
			});
			expect(result.current.activeTabIndex).toBe(2);
		});

		it('navigateRight wraps from last to first tab', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['task1', 'task2', 'task3'])),
			);

			act(() => {
				result.current.navigateRight();
				result.current.navigateRight();
				result.current.navigateRight();
			});
			expect(result.current.activeTabIndex).toBe(0);
		});
	});

	describe('Log filter cycles correctly', () => {
		it('cycles: null → stdout → stderr → null', () => {
			const { result } = renderHook(() => useViewState(makeOptions(['task1'])));

			expect(result.current.logFilter).toBeNull();

			act(() => result.current.cycleLogFilter());
			expect(result.current.logFilter).toBe('stdout');

			act(() => result.current.cycleLogFilter());
			expect(result.current.logFilter).toBe('stderr');

			act(() => result.current.cycleLogFilter());
			expect(result.current.logFilter).toBeNull();
		});
	});

	describe('Search and Timestamp actions', () => {
		it('toggles timestamps', () => {
			const { result } = renderHook(() => useViewState(makeOptions(['task1'])));

			expect(result.current.showTimestamps).toBe(false);
			act(() => result.current.toggleTimestamps());
			expect(result.current.showTimestamps).toBe(true);
			act(() => result.current.toggleTimestamps());
			expect(result.current.showTimestamps).toBe(false);
		});

		it('opens and closes search, resetting query', () => {
			const { result } = renderHook(() => useViewState(makeOptions(['task1'])));

			expect(result.current.showSearch).toBe(false);

			act(() => result.current.openSearch());
			expect(result.current.showSearch).toBe(true);

			act(() => result.current.setSearchQuery('test'));
			expect(result.current.searchQuery).toBe('test');

			act(() => result.current.closeSearch());
			expect(result.current.showSearch).toBe(false);
			expect(result.current.searchQuery).toBe('');
		});

		it('scrolls to index', () => {
			const { result } = renderHook(() =>
				useViewState(makeOptions(['task1'], { task1: 100 })),
			);

			// viewHeight is 20. Half view is 10.
			// Target index is 40.
			act(() => result.current.scrollToIndex(40, 100));

			// offset should ideally map to item 50 being at the bottom.
			// 99 - 50 = 49 offset from bottom.
			expect(result.current.primaryScrollOffset).toBe(49);
			expect(result.current.primaryAutoScroll).toBe(false);
		});
	});
});
