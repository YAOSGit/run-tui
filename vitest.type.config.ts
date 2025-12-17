import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: { label: 'type-tests', color: 'magenta' },
		environment: 'node',
		globals: true,
		typecheck: {
			enabled: true,
			tsconfig: './tsconfig.vitest.json',
			include: ['**/*.test-d.ts'],
		},
		include: ['**/*.test-d.ts'],
		exclude: ['node_modules', '**/*.test.ts', '**/*.test.tsx'],
		sequence: {
			groupOrder: 1,
		},
	},
});
