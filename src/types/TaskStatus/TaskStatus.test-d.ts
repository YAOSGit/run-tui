import { assertType, describe, expectTypeOf, it } from 'vitest';
import { TASK_STATUS, type TaskStatus } from './index.js';

describe('TaskStatus type tests', () => {
	it('TaskStatus is a union of literal string types', () => {
		expectTypeOf<TaskStatus>().toEqualTypeOf<
			'pending' | 'running' | 'success' | 'error' | 'restarting'
		>();
	});

	it('TASK_STATUS values satisfy TaskStatus', () => {
		assertType<TaskStatus>(TASK_STATUS.PENDING);
		assertType<TaskStatus>(TASK_STATUS.RUNNING);
		assertType<TaskStatus>(TASK_STATUS.SUCCESS);
		assertType<TaskStatus>(TASK_STATUS.ERROR);
		assertType<TaskStatus>(TASK_STATUS.RESTARTING);
	});

	it('TASK_STATUS is readonly', () => {
		expectTypeOf(TASK_STATUS).toMatchTypeOf<{
			readonly PENDING: 'pending';
			readonly RUNNING: 'running';
			readonly SUCCESS: 'success';
			readonly ERROR: 'error';
			readonly RESTARTING: 'restarting';
		}>();
	});

	it('rejects invalid status values', () => {
		// @ts-expect-error - 'invalid' is not a valid TaskStatus
		assertType<TaskStatus>('invalid');
	});
});
