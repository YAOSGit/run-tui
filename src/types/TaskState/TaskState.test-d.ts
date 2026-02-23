import { assertType, describe, it } from 'vitest';
import type { TaskState } from './index.js';

describe('TaskState type tests', () => {
	it('accepts valid TaskState objects', () => {
		assertType<TaskState>({
			name: 'build',
			status: 'running',
			exitCode: null,
			hasUnseenStderr: false,
			restartCount: 0,
			startedAt: Date.now(),
			endedAt: null,
		});

		assertType<TaskState>({
			name: 'test',
			status: 'success',
			exitCode: 0,
			hasUnseenStderr: true,
			restartCount: 1,
			startedAt: Date.now() - 1000,
			endedAt: Date.now(),
		});
	});

	it('rejects invalid status', () => {
		assertType<TaskState>({
			name: 'build',
			// @ts-expect-error - 'invalid' is not a valid TaskStatus
			status: 'invalid',
			exitCode: null,
			hasUnseenStderr: false,
			restartCount: 0,
			startedAt: null,
			endedAt: null,
		});
	});

	it('rejects missing properties', () => {
		// @ts-expect-error - missing required properties
		assertType<TaskState>({ name: 'build' });
	});
});
