import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'type-tests',
		environment: 'node',
		globals: true,
		typecheck: {
			enabled: true,
			tsconfig: './tsconfig.vitest.json',
			include: ['**/*.test-d.ts'],
		},
		include: ['**/*.test-d.ts'],
		exclude: ['node_modules', '**/*.test.ts', '**/*.test.tsx'],
	},
});
