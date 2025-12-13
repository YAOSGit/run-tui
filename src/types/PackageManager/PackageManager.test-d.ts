import { assertType, describe, expectTypeOf, it } from 'vitest';
import { PACKAGE_MANAGER, type PackageManager } from './index.js';

describe('PackageManager type tests', () => {
	it('PackageManager is a union of package manager string literals', () => {
		expectTypeOf<PackageManager>().toEqualTypeOf<
			'npm' | 'yarn' | 'pnpm' | 'bun'
		>();
	});

	it('PACKAGE_MANAGER values satisfy PackageManager type', () => {
		assertType<PackageManager>(PACKAGE_MANAGER.NPM);
		assertType<PackageManager>(PACKAGE_MANAGER.YARN);
		assertType<PackageManager>(PACKAGE_MANAGER.PNPM);
		assertType<PackageManager>(PACKAGE_MANAGER.BUN);
	});

	it('PACKAGE_MANAGER is readonly', () => {
		expectTypeOf(PACKAGE_MANAGER).toMatchTypeOf<{
			readonly NPM: 'npm';
			readonly YARN: 'yarn';
			readonly PNPM: 'pnpm';
			readonly BUN: 'bun';
		}>();
	});

	it('rejects invalid package manager values', () => {
		// @ts-expect-error - 'deno' is not a valid PackageManager
		assertType<PackageManager>('deno');
	});
});
