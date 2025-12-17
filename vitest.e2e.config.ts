import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		name: { label: 'e2e', color: 'yellow' },
		environment: 'node',
		globals: true,
		testTimeout: 30000,
		hookTimeout: 10000,
		typecheck: {
			tsconfig: './tsconfig.vitest.json',
		},
		include: ['e2e/*.e2e.ts'],
		exclude: ['node_modules'],
		pool: 'forks',
		maxWorkers: 1,
		isolate: false,
		sequence: {
			groupOrder: 2,
		},
	},
});
