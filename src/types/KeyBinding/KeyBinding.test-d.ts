import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { KeyBinding } from './index.js';

describe('KeyBinding type tests', () => {
	it('KeyBinding has correct optional property types', () => {
		expectTypeOf<KeyBinding>().toMatchTypeOf<{
			textKey?: string;
			specialKey?: string;
			ctrl?: boolean;
			shift?: boolean;
			meta?: boolean;
		}>();
	});

	it('all properties are optional', () => {
		expectTypeOf<KeyBinding['textKey']>().toEqualTypeOf<string | undefined>();
		expectTypeOf<KeyBinding['specialKey']>().toEqualTypeOf<
			string | undefined
		>();
		expectTypeOf<KeyBinding['ctrl']>().toEqualTypeOf<boolean | undefined>();
		expectTypeOf<KeyBinding['shift']>().toEqualTypeOf<boolean | undefined>();
		expectTypeOf<KeyBinding['meta']>().toEqualTypeOf<boolean | undefined>();
	});

	it('accepts empty object', () => {
		assertType<KeyBinding>({});
	});

	it('accepts textKey only', () => {
		assertType<KeyBinding>({ textKey: 'q' });
	});

	it('accepts specialKey only', () => {
		assertType<KeyBinding>({ specialKey: 'left' });
	});

	it('accepts key with modifiers', () => {
		assertType<KeyBinding>({ textKey: 'c', ctrl: true });
		assertType<KeyBinding>({ textKey: 's', ctrl: true, shift: true });
		assertType<KeyBinding>({ textKey: 'v', meta: true });
	});

	it('accepts all properties', () => {
		assertType<KeyBinding>({
			textKey: 'a',
			specialKey: 'enter',
			ctrl: true,
			shift: false,
			meta: true,
		});
	});

	it('rejects invalid property types', () => {
		// @ts-expect-error - textKey must be string
		assertType<KeyBinding>({ textKey: 123 });

		// @ts-expect-error - ctrl must be boolean
		assertType<KeyBinding>({ ctrl: 'true' });
	});
});
