import { describe, expectTypeOf, it } from 'vitest';
import { SEARCH_PROMPT_COLOR } from './SearchBar.consts.js';

describe('SearchBar constants', () => {
	it('SEARCH_PROMPT_COLOR should be a string', () => {
		expectTypeOf(SEARCH_PROMPT_COLOR).toBeString();
	});
});
