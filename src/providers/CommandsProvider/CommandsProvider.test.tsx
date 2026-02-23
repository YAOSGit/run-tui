/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import type { Key } from 'ink';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LogsProvider } from '../LogsProvider/index.js';
import { TasksProvider } from '../TasksProvider/index.js';
import { UIStateProvider } from '../UIStateProvider/index.js';
import { ViewProvider } from '../ViewProvider/index.js';
import { CommandsProvider, useCommands } from './index.js';

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

const createDefaultKey = (): Key => ({
	upArrow: false,
	downArrow: false,
	leftArrow: false,
	rightArrow: false,
	pageDown: false,
	pageUp: false,
	return: false,
	escape: false,
	ctrl: false,
	shift: false,
	tab: false,
	backspace: false,
	delete: false,
	meta: false,
});

const createWrapper =
	(props: { initialTasks?: string[]; keepAlive?: boolean } = {}) =>
		({ children }: { children: React.ReactNode }) => (
			<LogsProvider>
				<TasksProvider
					initialTasks={props.initialTasks ?? ['task1', 'task2']}
					packageManager="npm"
					onLogEntry={vi.fn()}
					restartConfig={{ enabled: false, delayMs: 0, maxAttempts: 0 }}
					scriptArgs={[]}
				>
					<UIStateProvider>
						<ViewProvider viewHeight={20}>
							<CommandsProvider
								keepAlive={props.keepAlive ?? false}
								onQuit={vi.fn()}
							>
								{children}
							</CommandsProvider>
						</ViewProvider>
					</UIStateProvider>
				</TasksProvider>
			</LogsProvider>
		);

describe('CommandsProvider', () => {
	describe('useCommands hook', () => {
		it('throws error when used outside provider', () => {
			expect(() => {
				renderHook(() => useCommands());
			}).toThrow('useCommands must be used within a CommandsProvider');
		});

		it('returns context value when used within provider', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			expect(result.current).toHaveProperty('handleInput');
			expect(result.current).toHaveProperty('getVisibleCommands');
		});
	});

	describe('getVisibleCommands', () => {
		it('returns array of visible commands', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			const commands = result.current.getVisibleCommands();

			expect(Array.isArray(commands)).toBe(true);
			expect(commands.length).toBeGreaterThan(0);
		});

		it('returns commands with displayKey and displayText', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			const commands = result.current.getVisibleCommands();

			for (const cmd of commands) {
				expect(cmd).toHaveProperty('displayKey');
				expect(cmd).toHaveProperty('displayText');
				expect(typeof cmd.displayKey).toBe('string');
				expect(typeof cmd.displayText).toBe('string');
			}
		});
	});

	describe('handleInput - navigation', () => {
		it('handles left arrow key', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('', {
					...createDefaultKey(),
					leftArrow: true,
				});
			});
		});

		it('handles right arrow key', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('', {
					...createDefaultKey(),
					rightArrow: true,
				});
			});
		});
	});

	describe('handleInput - scrolling', () => {
		it('handles scroll up (k key)', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('k', createDefaultKey());
			});
		});

		it('handles scroll down (j key)', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('j', createDefaultKey());
			});
		});

		it('handles scroll to bottom (G key)', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('G', { ...createDefaultKey(), shift: true });
			});
		});
	});

	describe('handleInput - filter', () => {
		it('handles filter toggle (f key)', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('f', createDefaultKey());
			});
		});
	});

	describe('handleInput - script selector', () => {
		it('handles new script (n key)', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('n', createDefaultKey());
			});
		});
	});

	describe('handleInput - confirmation flow', () => {
		it('ignores regular keys during confirmation', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// First trigger quit which requires confirmation
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});

			// Try pressing an unrelated key during confirmation (should be ignored)
			act(() => {
				result.current.handleInput('x', createDefaultKey());
			});

			// Should still be able to cancel with 'n'
			act(() => {
				result.current.handleInput('n', createDefaultKey());
			});
		});

		it('confirms with y key', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Trigger quit which requires confirmation
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});

			// Confirm with y
			act(() => {
				result.current.handleInput('y', createDefaultKey());
			});
		});

		it('cancels with escape key', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Trigger quit which requires confirmation
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});

			// Cancel with escape
			act(() => {
				result.current.handleInput('', { ...createDefaultKey(), escape: true });
			});
		});

		it('confirms with enter key', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Trigger quit which requires confirmation
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});

			// Confirm with enter
			act(() => {
				result.current.handleInput('', { ...createDefaultKey(), return: true });
			});
		});

		it('confirms with same key that triggered confirmation', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Trigger quit which requires confirmation
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});

			// Press q again to confirm
			act(() => {
				result.current.handleInput('q', createDefaultKey());
			});
		});
	});

	describe('handleInput - unknown keys', () => {
		it('ignores unknown keys', () => {
			const { result } = renderHook(() => useCommands(), {
				wrapper: createWrapper(),
			});

			// Should not throw
			act(() => {
				result.current.handleInput('z', createDefaultKey());
			});
		});
	});
});
