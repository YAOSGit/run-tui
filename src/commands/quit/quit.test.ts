import { describe, expect, it } from 'vitest';
import { createMockDeps } from '../../test-utils/mockDeps.js';
import { quitCommand } from './index.js';

describe('quitCommand', () => {
	it('has correct id', () => {
		expect(quitCommand.id).toBe('QUIT');
	});

	it('has correct keys', () => {
		expect(quitCommand.keys).toEqual([
			{ textKey: 'q', ctrl: false },
			{ specialKey: 'esc', ctrl: false },
		]);
	});

	it('has correct displayText', () => {
		expect(quitCommand.displayText).toBe('quit');
	});

	describe('isEnabled', () => {
		it('returns true when script selector is hidden', () => {
			const deps = createMockDeps({
				showScriptSelector: false,
			});
			expect(quitCommand.isEnabled(deps)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const deps = createMockDeps({
				showScriptSelector: true,
			});
			expect(quitCommand.isEnabled(deps)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls killAllTasks and onQuit', () => {
			const deps = createMockDeps();
			quitCommand.execute(deps);
			expect(deps.tasks.killAllTasks).toHaveBeenCalledOnce();
			expect(deps.onQuit).toHaveBeenCalledOnce();
		});
	});

	describe('needsConfirmation', () => {
		it('returns true when hasRunningTasks is true', () => {
			const deps = createMockDeps({
				hasRunningTasks: true,
				keepAlive: false,
			});
			expect(quitCommand.needsConfirmation?.(deps)).toBe(true);
		});

		it('returns true when keepAlive is true', () => {
			const deps = createMockDeps({
				hasRunningTasks: false,
				keepAlive: true,
			});
			expect(quitCommand.needsConfirmation?.(deps)).toBe(true);
		});

		it('returns false when no running tasks and keepAlive is false', () => {
			const deps = createMockDeps({
				hasRunningTasks: false,
				keepAlive: false,
			});
			expect(quitCommand.needsConfirmation?.(deps)).toBe(false);
		});
	});

	describe('confirmMessage', () => {
		it('returns message with running task count when tasks are running', () => {
			const deps = createMockDeps({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
						restartCount: 0,
						startedAt: 0,
						endedAt: null,
					},
					task2: {
						name: 'task2',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
						restartCount: 0,
						startedAt: 0,
						endedAt: null,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(deps)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 2 running tasks?');
		});

		it('returns message with singular form for one running task', () => {
			const deps = createMockDeps({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'running',
						exitCode: null,
						hasUnseenStderr: false,
						restartCount: 0,
						startedAt: 0,
						endedAt: null,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(deps)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit with 1 running task?');
		});

		it('returns simple quit message when no running tasks', () => {
			const deps = createMockDeps({
				taskStates: {
					task1: {
						name: 'task1',
						status: 'success',
						exitCode: 0,
						hasUnseenStderr: false,
						restartCount: 0,
						startedAt: 0,
						endedAt: null,
					},
				},
			});
			const message =
				typeof quitCommand.confirmMessage === 'function'
					? quitCommand.confirmMessage(deps)
					: quitCommand.confirmMessage;
			expect(message).toBe('Quit?');
		});
	});
});
