import { describe, expectTypeOf, it } from 'vitest';
import { SCROLL_AUTOSCROLL_COLOR, SCROLL_PAUSED_COLOR, STATUS_VARIANTS } from './Footer.consts.js';

describe('Footer constants', () => {
	it('STATUS_VARIANTS should be a readonly object', () => {
		expectTypeOf(STATUS_VARIANTS).toBeObject();
	});

	it('SCROLL_AUTOSCROLL_COLOR should be a string', () => {
		expectTypeOf(SCROLL_AUTOSCROLL_COLOR).toBeString();
	});

	it('SCROLL_PAUSED_COLOR should be a string', () => {
		expectTypeOf(SCROLL_PAUSED_COLOR).toBeString();
	});
});
