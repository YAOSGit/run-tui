import { describe, expectTypeOf, it } from 'vitest';
import type { Color } from '../../types/Color/index.js';
import type { TaskStatus } from '../../types/TaskStatus/index.js';
import { TAB_BAR_INDEX_COLORS, TAB_BAR_STATUS_COLORS } from './TabBar.consts.js';

describe('TabBar constants', () => {
	it('TAB_BAR_STATUS_COLORS should be Record<TaskStatus, Color>', () => {
		expectTypeOf(TAB_BAR_STATUS_COLORS).toMatchTypeOf<Record<TaskStatus, Color>>();
	});

	it('TAB_BAR_INDEX_COLORS should be an array of Color', () => {
		expectTypeOf(TAB_BAR_INDEX_COLORS).toMatchTypeOf<Color[]>();
	});
});
