import { describe, expectTypeOf, it } from 'vitest';
import type { LogType } from '../../types/LogType/index.js';
import { LOG_FILTERS } from './useViewState.consts.js';

describe('useViewState constants', () => {
	it('LOG_FILTERS should be an array of LogType | null', () => {
		expectTypeOf(LOG_FILTERS).toMatchTypeOf<(LogType | null)[]>();
	});
});
