import { assertType, describe, expectTypeOf, it } from 'vitest';
import { DEFAULT_RESTART_CONFIG, type RestartConfig } from './index.js';

describe('RestartConfig type tests', () => {
	it('accepts valid RestartConfig objects', () => {
		assertType<RestartConfig>({
			enabled: true,
			delayMs: 1000,
			maxAttempts: 5,
		});

		assertType<RestartConfig>({
			enabled: false,
			delayMs: 2000,
			maxAttempts: 3,
			exitCodes: [1, 2, 127],
		});
	});

	it('exitCodes is optional', () => {
		assertType<RestartConfig>({
			enabled: true,
			delayMs: 500,
			maxAttempts: 1,
		});
	});

	it('DEFAULT_RESTART_CONFIG satisfies RestartConfig', () => {
		assertType<RestartConfig>(DEFAULT_RESTART_CONFIG);
	});

	it('rejects missing required properties', () => {
		// @ts-expect-error - missing required properties
		assertType<RestartConfig>({ enabled: true });
	});

	it('rejects invalid property types', () => {
		assertType<RestartConfig>({
			// @ts-expect-error - enabled must be boolean
			enabled: 'yes',
			delayMs: 1000,
			maxAttempts: 3,
		});
	});

	it('has correct property types', () => {
		expectTypeOf<RestartConfig['enabled']>().toEqualTypeOf<boolean>();
		expectTypeOf<RestartConfig['delayMs']>().toEqualTypeOf<number>();
		expectTypeOf<RestartConfig['maxAttempts']>().toEqualTypeOf<number>();
		expectTypeOf<RestartConfig['exitCodes']>().toEqualTypeOf<
			number[] | undefined
		>();
	});
});
