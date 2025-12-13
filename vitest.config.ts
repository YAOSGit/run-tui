import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.test.{ts,tsx}'],
		typecheck: {
			include: ['src/**/*.test-d.{ts,tsx}'],
		},
	},
});
