import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: 'react',
		environment: 'jsdom',
		globals: true,
		typecheck: {
			tsconfig: './tsconfig.vitest.json',
		},
		include: ['**/*.test.tsx'],
		exclude: ['node_modules', '**/*.test.ts', '**/*.test-d.ts'],
	},
});
