import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: [
			'./vitest.unit.config.ts',
			'./vitest.type.config.ts',
			'./vitest.react.config.ts',
		],
	},
});
