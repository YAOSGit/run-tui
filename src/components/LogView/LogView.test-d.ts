import { describe, expectTypeOf, it } from 'vitest';
import { SEARCH_HIGHLIGHT } from './LogView.consts.js';

describe('LogView constants', () => {
	it('SEARCH_HIGHLIGHT should be an object with backgroundColor and color', () => {
		expectTypeOf(SEARCH_HIGHLIGHT).toBeObject();
		expectTypeOf(SEARCH_HIGHLIGHT.backgroundColor).toBeString();
		expectTypeOf(SEARCH_HIGHLIGHT.color).toBeString();
	});
});
