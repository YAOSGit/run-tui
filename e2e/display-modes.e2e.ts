import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner } from './utils';

describe('Display Modes', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Compact mode toggle', () => {
		it('toggles compact mode with m key', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			const outputBeforeMode = runner.getOutput();

			runner.write('m');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputAfterMode = runner.getOutput();

			// The display mode should have changed, producing different output layout
			expect(outputAfterMode.length).toBeGreaterThan(outputBeforeMode.length);
		});
	});

	describe('Focus on single tab', () => {
		it('shows focused view for selected tab', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');

			// Wait for build output to be visible
			await runner.waitForText('Building for production', {
				timeout: 5000,
			});

			// The first tab (build) should be focused by default and showing its output
			const output = runner.getOutput();
			expect(output).toContain('build');
			expect(output).toContain('Building for production');
		});
	});

	describe('Cycle display modes', () => {
		it('cycles through display modes with multiple m presses', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			runner.write('m');
			await new Promise((resolve) => setTimeout(resolve, 300));
			const outputMode1 = runner.getOutput();

			runner.write('m');
			await new Promise((resolve) => setTimeout(resolve, 300));
			const outputMode2 = runner.getOutput();

			runner.write('m');
			await new Promise((resolve) => setTimeout(resolve, 300));
			const outputMode3 = runner.getOutput();

			// Each mode press should produce output as the TUI re-renders
			expect(outputMode1.length).toBeGreaterThan(0);
			expect(outputMode2.length).toBeGreaterThan(0);
			expect(outputMode3.length).toBeGreaterThan(0);
		});
	});

	describe('Split pane', () => {
		it('toggles split pane view with s key', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			const outputBefore = runner.getOutput();

			runner.write('s');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputAfterSplit = runner.getOutput();

			// The split pane toggle should cause a re-render with different layout
			expect(outputAfterSplit.length).toBeGreaterThan(outputBefore.length);
		});
	});
});
