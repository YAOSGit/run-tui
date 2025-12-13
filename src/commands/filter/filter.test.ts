import { describe, expect, it, vi } from 'vitest';
import type { CommandContext } from '../../types/CommandContext/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { filterCommand } from './index.js';

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
	killProcess: vi.fn(),
	spawnTask: vi.fn(),
	handleQuit: vi.fn(),
	setShowScriptSelector: vi.fn(),
	setLogFilter: vi.fn(),
	removeTask: vi.fn(),
	setRunningTasks: vi.fn(),
	setActiveTabIndex: vi.fn(),
	markStderrSeen: vi.fn(),
	...overrides,
});

describe('filterCommand', () => {
	describe('properties', () => {
		it('has correct id', () => {
			expect(filterCommand.id).toBe('FILTER');
		});

		it('has correct keys', () => {
			expect(filterCommand.keys).toEqual([{ textKey: 'f', ctrl: false }]);
		});

		it('has correct displayText', () => {
			expect(filterCommand.displayText).toBe('filter');
		});
	});

	describe('isEnabled', () => {
		it('returns false when script selector is shown', () => {
			const ctx = createMockContext({ showScriptSelector: true });
			expect(filterCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns false when no running tasks', () => {
			const ctx = createMockContext({ runningTasks: [] });
			expect(filterCommand.isEnabled(ctx)).toBe(false);
		});

		it('returns true when tasks are running and script selector is hidden', () => {
			const ctx = createMockContext({
				showScriptSelector: false,
				runningTasks: ['build'],
			});
			expect(filterCommand.isEnabled(ctx)).toBe(true);
		});
	});

	describe('execute', () => {
		it('cycles from null to stdout', () => {
			const ctx = createMockContext({ logFilter: null });
			filterCommand.execute(ctx);

			expect(ctx.setLogFilter).toHaveBeenCalled();
			const updateFn = (ctx.setLogFilter as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(null)).toBe(LOG_TYPE.STDOUT);
		});

		it('cycles from stdout to stderr', () => {
			const ctx = createMockContext({ logFilter: LOG_TYPE.STDOUT });
			filterCommand.execute(ctx);

			const updateFn = (ctx.setLogFilter as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(LOG_TYPE.STDOUT)).toBe(LOG_TYPE.STDERR);
		});

		it('cycles from stderr back to null', () => {
			const ctx = createMockContext({ logFilter: LOG_TYPE.STDERR });
			filterCommand.execute(ctx);

			const updateFn = (ctx.setLogFilter as ReturnType<typeof vi.fn>).mock
				.calls[0][0];
			expect(updateFn(LOG_TYPE.STDERR)).toBe(null);
		});
	});
});
