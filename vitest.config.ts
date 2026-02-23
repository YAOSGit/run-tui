import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: [
			'./vitest.unit.config.ts',
			'./vitest.type.config.ts',
			'./vitest.react.config.ts',
			'./vitest.e2e.config.ts',
		],
		coverage: {
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'e2e/**',
				'src/app/**',
				'node_modules/**',
				'**/*.test.{ts,tsx}',
				'**/*.test-d.ts',
			],
		},
	},
});
