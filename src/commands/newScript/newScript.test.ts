import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { newScriptCommand } from './index.js';

const createMockContext = (
	overrides: Partial<CommandContext> = {},
): CommandContext => ({
	activeTask: 'build',
	taskStatus: 'running',
	runningTasks: ['build', 'test'],
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

describe('newScriptCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(newScriptCommand.id).toBe('NEW_SCRIPT');
		});

		it('has correct keys', () => {
			expect(newScriptCommand.keys).toEqual([{ textKey: 'n', ctrl: false }]);
		});

		it('has correct displayText', () => {
			expect(newScriptCommand.displayText).toBe('new');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is already shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(newScriptCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when script selector is hidden', () => {
			const ctx = createMockContext({ showScriptSelector: false });
			expect(newScriptCommand.isEnabled(ctx)).toBe(true);
		});

		it('returns true even when no running tasks', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: [],
			});
			expect(newScriptCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('shows the script selector', () => {
			const ctx = createMockContext();
			newScriptCommand.execute(ctx);

			expect(ctx.setShowScriptSelector).toHaveBeenCalledWith(true);
		});
	});
});
