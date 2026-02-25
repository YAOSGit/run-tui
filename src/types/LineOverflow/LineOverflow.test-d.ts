import { assertType, describe, expectTypeOf, it } from 'vitest';
import { LINE_OVERFLOW, type LineOverflow } from './index.js';

describe('LineOverflow type tests', () => {
	it('LineOverflow is a union of overflow string literals', () => {
		expectTypeOf<LineOverflow>().toEqualTypeOf<
			'wrap' | 'truncate' | 'truncate-end'
		>();
	});

	it('LINE_OVERFLOW values satisfy LineOverflow type', () => {
		assertType<LineOverflow>(LINE_OVERFLOW.WRAP);
		assertType<LineOverflow>(LINE_OVERFLOW.TRUNCATE);
		assertType<LineOverflow>(LINE_OVERFLOW.TRUNCATE_END);
	});

	it('rejects invalid overflow values', () => {
		// @ts-expect-error - 'scroll' is not a valid LineOverflow
		assertType<LineOverflow>('scroll');
	});

	it('LINE_OVERFLOW const has the correct shape', () => {
		expectTypeOf(LINE_OVERFLOW.WRAP).toEqualTypeOf<'wrap'>();
		expectTypeOf(LINE_OVERFLOW.TRUNCATE).toEqualTypeOf<'truncate'>();
		expectTypeOf(LINE_OVERFLOW.TRUNCATE_END).toEqualTypeOf<'truncate-end'>();
	});
});
