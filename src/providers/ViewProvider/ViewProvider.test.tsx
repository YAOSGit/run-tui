/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { LogsProvider } from '../LogsProvider/index.js';
import { TasksProvider } from '../TasksProvider/index.js';
import { useView, ViewProvider } from './index.js';

// Create hoisted mock functions for useProcessManager
const mockSpawnProcess = vi.hoisted(() => vi.fn());
const mockKillProcess = vi.hoisted(() => vi.fn());
const mockKillAllProcesses = vi.hoisted(() => vi.fn());

// Mock useProcessManager
vi.mock('../../hooks/useProcessManager/index.js', () => ({
	useProcessManager: () => ({
		spawnProcess: mockSpawnProcess,
		killProcess: mockKillProcess,
		killAllProcesses: mockKillAllProcesses,
	}),
}));

const createWrapper =
	(props: { initialTasks?: string[]; viewHeight?: number } = {}) =>
	({ children }: { children: React.ReactNode }) => (
		<LogsProvider>
			<TasksProvider
				initialTasks={props.initialTasks ?? ['task1', 'task2']}
				packageManager="npm"
				onLogEntry={vi.fn()}
				restartConfig={{ enabled: true, delayMs: 1000, maxAttempts: 5 }}
				scriptArgs={[]}
			>
				<ViewProvider viewHeight={props.viewHeight ?? 20}>
					{children}
				</ViewProvider>
			</TasksProvider>
		</LogsProvider>
	);

describe('ViewProvider', () => {
	describe('useView hook', () => {
		it('throws error when used outside provider', () => {
			expect(() => {
				renderHook(() => useView());
			}).toThrow('useView must be used within a ViewProvider');
		});

		it('returns context value when used within provider', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			expect(result.current).toHaveProperty('activeTabIndex');
			expect(result.current).toHaveProperty('activeTask');
			expect(result.current).toHaveProperty('logFilter');
			expect(result.current).toHaveProperty('primaryScrollOffset');
			expect(result.current).toHaveProperty('primaryAutoScroll');
			expect(result.current).toHaveProperty('viewHeight');
			expect(result.current).toHaveProperty('totalLogs');
			expect(result.current).toHaveProperty('navigateLeft');
			expect(result.current).toHaveProperty('navigateRight');
			expect(result.current).toHaveProperty('setActiveTabIndex');
			expect(result.current).toHaveProperty('cycleLogFilter');
			expect(result.current).toHaveProperty('scrollUp');
			expect(result.current).toHaveProperty('scrollDown');
			expect(result.current).toHaveProperty('scrollToBottom');
			expect(result.current).toHaveProperty('showRenameInput');
			expect(result.current).toHaveProperty('openRenameInput');
			expect(result.current).toHaveProperty('closeRenameInput');
		});
	});

	describe('initial state', () => {
		it('starts with activeTabIndex 0', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			expect(result.current.activeTabIndex).toBe(0);
		});

		it('has first task as activeTask', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			expect(result.current.activeTask).toBe('task1');
		});

		it('has logFilter as null initially', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			expect(result.current.logFilter).toBeNull();
		});

		it('has autoScroll true initially', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			expect(result.current.primaryAutoScroll).toBe(true);
		});

		it('has correct viewHeight', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ viewHeight: 30 }),
			});

			expect(result.current.viewHeight).toBe(30);
		});
	});

	describe('navigation', () => {
		it('navigateRight moves to next tab', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.navigateRight();
			});

			expect(result.current.activeTabIndex).toBe(1);
			expect(result.current.activeTask).toBe('task2');
		});

		it('navigateLeft moves to previous tab', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			// First go right
			act(() => {
				result.current.navigateRight();
			});

			// Then go left
			act(() => {
				result.current.navigateLeft();
			});

			expect(result.current.activeTabIndex).toBe(0);
			expect(result.current.activeTask).toBe('task1');
		});

		it('navigateRight wraps around to first tab', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.navigateRight();
				result.current.navigateRight();
			});

			expect(result.current.activeTabIndex).toBe(0);
		});

		it('navigateLeft wraps around to last tab', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2'] }),
			});

			act(() => {
				result.current.navigateLeft();
			});

			expect(result.current.activeTabIndex).toBe(1);
		});

		it('setActiveTabIndex sets specific tab', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper({ initialTasks: ['task1', 'task2', 'task3'] }),
			});

			act(() => {
				result.current.setActiveTabIndex(2);
			});

			expect(result.current.activeTabIndex).toBe(2);
			expect(result.current.activeTask).toBe('task3');
		});
	});

	describe('log filter', () => {
		it('cycleLogFilter cycles through filter options', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			// Initial state: null (all logs)
			expect(result.current.logFilter).toBeNull();

			// Cycle to stdout
			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBe(LOG_TYPE.STDOUT);

			// Cycle to stderr
			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBe(LOG_TYPE.STDERR);

			// Cycle back to null
			act(() => {
				result.current.cycleLogFilter();
			});
			expect(result.current.logFilter).toBeNull();
		});
	});

	describe('scrolling', () => {
		it('scrollDown is callable', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			// scrollDown should not throw
			act(() => {
				result.current.scrollDown();
			});

			// With no logs, scrollOffset stays at 0
			expect(result.current.primaryScrollOffset).toBe(0);
		});

		it('scrollUp is callable', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			// scrollUp should not throw
			act(() => {
				result.current.scrollUp();
			});

			// scrollUp disables autoScroll
			expect(result.current.primaryAutoScroll).toBe(false);
		});

		it('scrollToBottom resets scrollOffset to 0 and enables autoScroll', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			// First scroll up (which disables autoScroll)
			act(() => {
				result.current.scrollUp();
			});

			expect(result.current.primaryAutoScroll).toBe(false);

			// Scroll to bottom
			act(() => {
				result.current.scrollToBottom();
			});

			expect(result.current.primaryScrollOffset).toBe(0);
			expect(result.current.primaryAutoScroll).toBe(true);
		});

		it('scrolling up disables autoScroll', () => {
			const { result } = renderHook(() => useView(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.scrollUp();
			});

			expect(result.current.primaryAutoScroll).toBe(false);
		});
	});
});
