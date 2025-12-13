import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { VisibleCommand } from './index.js';

describe('VisibleCommand type tests', () => {
	it('VisibleCommand has correct property types', () => {
		expectTypeOf<VisibleCommand>().toMatchTypeOf<{
			displayKey: string;
			displayText: string;
		}>();
	});

	it('displayKey is string', () => {
		expectTypeOf<VisibleCommand['displayKey']>().toEqualTypeOf<string>();
	});

	it('displayText is string', () => {
		expectTypeOf<VisibleCommand['displayText']>().toEqualTypeOf<string>();
	});

	it('accepts valid VisibleCommand', () => {
		assertType<VisibleCommand>({
			displayKey: 'q',
			displayText: 'quit',
		});
	});

	it('accepts special characters in displayKey', () => {
		assertType<VisibleCommand>({
			displayKey: '←/→',
			displayText: 'switch',
		});
	});

	it('rejects missing displayKey', () => {
		// @ts-expect-error - missing displayKey
		assertType<VisibleCommand>({ displayText: 'quit' });
	});

	it('rejects missing displayText', () => {
		// @ts-expect-error - missing displayText
		assertType<VisibleCommand>({ displayKey: 'q' });
	});

	it('rejects invalid property types', () => {
		// @ts-expect-error - displayKey must be string
		assertType<VisibleCommand>({ displayKey: 123, displayText: 'quit' });
	});
});
