import { describe, expectTypeOf, it } from 'vitest';
import type { PendingConfirmation } from './index.js';

describe('PendingConfirmation (re-exported)', () => {
	it('has message as string', () => {
		expectTypeOf<PendingConfirmation>().toHaveProperty('message');
		expectTypeOf<PendingConfirmation['message']>().toEqualTypeOf<string>();
	});

	it('has onConfirm as function returning void', () => {
		expectTypeOf<PendingConfirmation>().toHaveProperty('onConfirm');
		expectTypeOf<PendingConfirmation['onConfirm']>().toEqualTypeOf<() => void>();
	});
});
