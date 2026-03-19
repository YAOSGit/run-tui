import { describe, expectTypeOf, it } from 'vitest';
import { MAX_LOGS_PER_TASK } from './useLogs.consts.js';

describe('useLogs constants', () => {
	it('MAX_LOGS_PER_TASK should be a number', () => {
		expectTypeOf(MAX_LOGS_PER_TASK).toBeNumber();
	});
});
