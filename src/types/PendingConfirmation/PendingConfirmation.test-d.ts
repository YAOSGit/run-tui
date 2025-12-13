import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { Command } from '../Command/index.js';
import type { PendingConfirmation } from './index.js';

describe('PendingConfirmation type tests', () => {
	it('PendingConfirmation has correct property types', () => {
		expectTypeOf<PendingConfirmation>().toMatchTypeOf<{
			command: Command;
			message: string;
		}>();
	});

	it('command is Command type', () => {
		expectTypeOf<PendingConfirmation['command']>().toEqualTypeOf<Command>();
	});

	it('message is string', () => {
		expectTypeOf<PendingConfirmation['message']>().toEqualTypeOf<string>();
	});

	it('rejects missing command', () => {
		// @ts-expect-error - missing command property
		assertType<PendingConfirmation>({ message: 'Confirm?' });
	});

	it('rejects missing message', () => {
		// @ts-expect-error - missing message property
		assertType<PendingConfirmation>({
			command: {
				id: 'TEST',
				keys: [],
				displayText: 'test',
				isEnabled: () => true,
				execute: () => {},
			},
		});
	});
});
