import { act, renderHook } from '@testing-library/react';
import type { Key } from 'ink';
import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { useCommandRegistry } from './index.js';

const createMockKey = (overrides: Partial<Key> = {}): Key => ({
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
	...overrides,
});

const createMockContext = (
	overrides: Partial<CommandContext> = {},
): CommandContext => ({
	activeTask: 'build',
	taskStatus: 'running',
	runningTasks: ['build'],
	hasRunningTasks: true,
	keepAlive: false,
	showScriptSelector: false,
	logFilter: null,
	scrollOffset: 0,
	totalLogs: 100,
	autoScroll: true,
	viewHeight: 20,
	killProcess: vi.fn(),
	spawnTask: vi.fn(),
	handleQuit: vi.fn(),
	setShowScriptSelector: vi.fn(),
	setLogFilter: vi.fn(),
	removeTask: vi.fn(),
	setRunningTasks: vi.fn(),
	setActiveTabIndex: vi.fn(),
	markStderrSeen: vi.fn(),
	scrollUp: vi.fn(),
	scrollDown: vi.fn(),
	scrollToBottom: vi.fn(),
	...overrides,
});

describe('useCommandRegistry', () => {
	describe('handleInput', () => {
		it('executes quit command on q key', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({
				handleQuit,
				hasRunningTasks: false,
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			expect(handleQuit).toHaveBeenCalled();
		});

		it('triggers confirmation for quit when tasks are running', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({ handleQuit, hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			expect(handleQuit).not.toHaveBeenCalled();
			expect(result.current.pendingConfirmation).not.toBeNull();
			expect(result.current.pendingConfirmation?.message).toContain('running');
		});

		it('confirms action with y key', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({ handleQuit, hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			// Trigger quit to get confirmation
			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			expect(result.current.pendingConfirmation).not.toBeNull();

			// Confirm with y
			act(() => {
				result.current.handleInput('y', createMockKey());
			});

			expect(handleQuit).toHaveBeenCalled();
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('confirms action with Enter key', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({ handleQuit, hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			act(() => {
				result.current.handleInput('', createMockKey({ return: true }));
			});

			expect(handleQuit).toHaveBeenCalled();
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('confirms action by pressing the same key again', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({ handleQuit, hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			// Press q again to confirm
			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			expect(handleQuit).toHaveBeenCalled();
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('cancels confirmation with n key', () => {
			const handleQuit = vi.fn();
			const context = createMockContext({ handleQuit, hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			act(() => {
				result.current.handleInput('n', createMockKey());
			});

			expect(handleQuit).not.toHaveBeenCalled();
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('cancels confirmation with Escape key', () => {
			const handleQuit = vi.fn();
			// Use keepAlive: true to prevent quit from being triggered by escape
			const context = createMockContext({
				handleQuit,
				hasRunningTasks: true,
				keepAlive: true,
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			act(() => {
				result.current.handleInput('', createMockKey({ escape: true }));
			});

			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('ignores other keys during confirmation', () => {
			const handleQuit = vi.fn();
			const setLogFilter = vi.fn();
			const context = createMockContext({
				handleQuit,
				hasRunningTasks: true,
				setLogFilter,
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			// Try pressing f (filter command) - should be ignored
			act(() => {
				result.current.handleInput('f', createMockKey());
			});

			expect(setLogFilter).not.toHaveBeenCalled();
			expect(result.current.pendingConfirmation).not.toBeNull();
		});

		it('executes filter command on f key', () => {
			const setLogFilter = vi.fn();
			const context = createMockContext({ setLogFilter });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('f', createMockKey());
			});

			expect(setLogFilter).toHaveBeenCalled();
		});

		it('navigates left on left arrow', () => {
			const setActiveTabIndex = vi.fn();
			const context = createMockContext({ setActiveTabIndex });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('', createMockKey({ leftArrow: true }));
			});

			expect(setActiveTabIndex).toHaveBeenCalled();
		});

		it('navigates right on right arrow', () => {
			const setActiveTabIndex = vi.fn();
			const context = createMockContext({ setActiveTabIndex });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('', createMockKey({ rightArrow: true }));
			});

			expect(setActiveTabIndex).toHaveBeenCalled();
		});

		it('scrolls up on up arrow', () => {
			const scrollUp = vi.fn();
			const context = createMockContext({ scrollUp });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('', createMockKey({ upArrow: true }));
			});

			expect(scrollUp).toHaveBeenCalled();
		});

		it('scrolls down on down arrow when scrollOffset > 0', () => {
			const scrollDown = vi.fn();
			const context = createMockContext({
				scrollDown,
				scrollOffset: 10, // Must be > 0 to enable scroll down
				totalLogs: 100,
				viewHeight: 20,
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('', createMockKey({ downArrow: true }));
			});

			expect(scrollDown).toHaveBeenCalled();
		});

		it('scrolls to bottom on b key when autoScroll is false', () => {
			const scrollToBottom = vi.fn();
			const context = createMockContext({ scrollToBottom, autoScroll: false });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('b', createMockKey());
			});

			expect(scrollToBottom).toHaveBeenCalled();
		});

		it('opens script selector on n key', () => {
			const setShowScriptSelector = vi.fn();
			const context = createMockContext({ setShowScriptSelector });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('n', createMockKey());
			});

			expect(setShowScriptSelector).toHaveBeenCalledWith(true);
		});

		it('does not execute command when disabled', () => {
			const killProcess = vi.fn();
			const context = createMockContext({
				killProcess,
				activeTask: undefined, // No active task, kill should be disabled
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('k', createMockKey());
			});

			expect(killProcess).not.toHaveBeenCalled();
		});
	});

	describe('getVisibleCommands', () => {
		it('returns enabled commands', () => {
			const context = createMockContext();
			const { result } = renderHook(() => useCommandRegistry(context));

			const commands = result.current.getVisibleCommands();

			expect(commands.length).toBeGreaterThan(0);
			expect(commands.some((c) => c.displayText === 'quit')).toBe(true);
		});

		it('filters out disabled commands', () => {
			const context = createMockContext({
				showScriptSelector: true, // Most commands are disabled when selector is open
			});
			const { result } = renderHook(() => useCommandRegistry(context));

			const commands = result.current.getVisibleCommands();

			// Most commands should be filtered when script selector is shown
			expect(commands.some((c) => c.displayText === 'filter')).toBe(false);
		});

		it('deduplicates commands with same displayKey and displayText', () => {
			const context = createMockContext();
			const { result } = renderHook(() => useCommandRegistry(context));

			const commands = result.current.getVisibleCommands();
			const keys = commands.map((c) => `${c.displayKey}-${c.displayText}`);
			const uniqueKeys = new Set(keys);

			expect(keys.length).toBe(uniqueKeys.size);
		});
	});

	describe('pendingConfirmation', () => {
		it('starts as null', () => {
			const context = createMockContext();
			const { result } = renderHook(() => useCommandRegistry(context));

			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('includes command and message when set', () => {
			const context = createMockContext({ hasRunningTasks: true });
			const { result } = renderHook(() => useCommandRegistry(context));

			act(() => {
				result.current.handleInput('q', createMockKey());
			});

			expect(result.current.pendingConfirmation).toEqual({
				command: expect.objectContaining({ id: expect.any(String) }),
				message: expect.any(String),
			});
		});
	});
});
