import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { LogType } from '../LogType/index.js';
import type { LogEntry } from './index.js';

describe('LogEntry type tests', () => {
	it('LogEntry has correct property types', () => {
		expectTypeOf<LogEntry>().toMatchTypeOf<{
			id: string;
			task: string;
			text: string;
			type: LogType;
			timestamp: string;
		}>();
	});

	it('id is string', () => {
		expectTypeOf<LogEntry['id']>().toEqualTypeOf<string>();
	});

	it('task is string', () => {
		expectTypeOf<LogEntry['task']>().toEqualTypeOf<string>();
	});

	it('text is string', () => {
		expectTypeOf<LogEntry['text']>().toEqualTypeOf<string>();
	});

	it('type is LogType', () => {
		expectTypeOf<LogEntry['type']>().toEqualTypeOf<LogType>();
	});

	it('timestamp is string', () => {
		expectTypeOf<LogEntry['timestamp']>().toEqualTypeOf<string>();
	});

	it('accepts valid LogEntry objects', () => {
		assertType<LogEntry>({
			id: 'log-1',
			task: 'build',
			text: 'Compiling...',
			type: 'stdout',
			timestamp: '12:00:00',
		});
	});

	it('rejects invalid type', () => {
		assertType<LogEntry>({
			id: 'log-1',
			task: 'build',
			text: 'error',
			// @ts-expect-error - 'info' is not a valid LogType
			type: 'info',
			timestamp: '12:00:00',
		});
	});

	it('rejects missing properties', () => {
		// @ts-expect-error - missing required properties
		assertType<LogEntry>({ id: 'log-1', task: 'build' });
	});
});
