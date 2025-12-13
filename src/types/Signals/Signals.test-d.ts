import { describe, expectTypeOf, it } from 'vitest';
import { SIGNALS } from './index.js';

describe('Signals type tests', () => {
	it('SIGNALS is readonly', () => {
		expectTypeOf(SIGNALS).toMatchTypeOf<{
			readonly SIGINT: 'SIGINT';
			readonly SIGTERM: 'SIGTERM';
			readonly SIGKILL: 'SIGKILL';
			readonly SIGQUIT: 'SIGQUIT';
			readonly SIGABRT: 'SIGABRT';
			readonly SIGALRM: 'SIGALRM';
			readonly SIGBREAK: 'SIGBREAK';
			readonly SIGFPE: 'SIGFPE';
			readonly SIGILL: 'SIGILL';
		}>();
	});

	it('SIGNALS values are their key names', () => {
		expectTypeOf(SIGNALS.SIGINT).toEqualTypeOf<'SIGINT'>();
		expectTypeOf(SIGNALS.SIGTERM).toEqualTypeOf<'SIGTERM'>();
		expectTypeOf(SIGNALS.SIGKILL).toEqualTypeOf<'SIGKILL'>();
	});
});
