import { describe, expectTypeOf, it } from 'vitest';
import { SCROLL_AUTOSCROLL_COLOR, SCROLL_PAUSED_COLOR, SPLIT_PANE_TITLE_COLOR } from './app.consts.js';

describe('app constants', () => {
	it('SCROLL_AUTOSCROLL_COLOR should be a string', () => {
		expectTypeOf(SCROLL_AUTOSCROLL_COLOR).toBeString();
	});

	it('SCROLL_PAUSED_COLOR should be a string', () => {
		expectTypeOf(SCROLL_PAUSED_COLOR).toBeString();
	});

	it('SPLIT_PANE_TITLE_COLOR should be a string', () => {
		expectTypeOf(SPLIT_PANE_TITLE_COLOR).toBeString();
	});
});
