import { assertType, describe, expectTypeOf, it } from 'vitest';
import { LOG_TYPE, type LogType } from './index.js';

describe('LogType type tests', () => {
	it('LogType is a union of literal string types', () => {
		expectTypeOf<LogType>().toEqualTypeOf<'stdout' | 'stderr' | 'divider'>();
	});

	it('LOG_TYPE values satisfy LogType', () => {
		assertType<LogType>(LOG_TYPE.STDOUT);
		assertType<LogType>(LOG_TYPE.STDERR);
		assertType<LogType>(LOG_TYPE.DIVIDER);
	});

	it('LOG_TYPE is readonly', () => {
		expectTypeOf(LOG_TYPE).toMatchTypeOf<{
			readonly STDOUT: 'stdout';
			readonly STDERR: 'stderr';
			readonly DIVIDER: 'divider';
		}>();
	});

	it('rejects invalid log type values', () => {
		// @ts-expect-error - 'info' is not a valid LogType
		assertType<LogType>('info');
	});
});
