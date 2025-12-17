import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: { label: 'react', color: 'blue' },
		environment: 'jsdom',
		globals: true,
		typecheck: {
			tsconfig: './tsconfig.vitest.json',
		},
		include: ['**/*.test.tsx'],
		exclude: ['node_modules', '**/*.test.ts', '**/*.test-d.ts'],
		sequence: {
			groupOrder: 1,
		},
	},
});
