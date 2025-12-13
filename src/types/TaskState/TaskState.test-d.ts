import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { TaskStatus } from '../TaskStatus/index.js';
import type { TaskState } from './index.js';

describe('TaskState type tests', () => {
	it('TaskState has correct property types', () => {
		expectTypeOf<TaskState>().toMatchTypeOf<{
			name: string;
			status: TaskStatus;
			exitCode: number | null;
			hasUnseenStderr: boolean;
		}>();
	});

	it('name is string', () => {
		expectTypeOf<TaskState['name']>().toEqualTypeOf<string>();
	});

	it('status is TaskStatus', () => {
		expectTypeOf<TaskState['status']>().toEqualTypeOf<TaskStatus>();
	});

	it('exitCode is number or null', () => {
		expectTypeOf<TaskState['exitCode']>().toEqualTypeOf<number | null>();
	});

	it('hasUnseenStderr is boolean', () => {
		expectTypeOf<TaskState['hasUnseenStderr']>().toEqualTypeOf<boolean>();
	});

	it('accepts valid TaskState objects', () => {
		assertType<TaskState>({
			name: 'build',
			status: 'running',
			exitCode: null,
			hasUnseenStderr: false,
		});

		assertType<TaskState>({
			name: 'test',
			status: 'success',
			exitCode: 0,
			hasUnseenStderr: true,
		});
	});

	it('rejects invalid status', () => {
		assertType<TaskState>({
			name: 'build',
			// @ts-expect-error - 'invalid' is not a valid TaskStatus
			status: 'invalid',
			exitCode: null,
			hasUnseenStderr: false,
		});
	});

	it('rejects missing properties', () => {
		// @ts-expect-error - missing required properties
		assertType<TaskState>({ name: 'build' });
	});
});
