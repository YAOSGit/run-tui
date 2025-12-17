import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: { label: 'unit', color: 'green' },
		environment: 'node',
		globals: true,
		typecheck: {
			tsconfig: './tsconfig.vitest.json',
		},
		include: ['**/*.test.ts'],
		exclude: ['node_modules', '**/*.test.tsx', '**/*.test-d.ts'],
	},
});
