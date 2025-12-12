export const PACKAGE_MANAGER = {
	NPM: 'npm',
	YARN: 'yarn',
	PNPM: 'pnpm',
	BUN: 'bun',
} as const;
export type PackageManager =
	(typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];
