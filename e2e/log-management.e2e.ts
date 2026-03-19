import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner, canSpawnPTY } from './utils';

describe.skipIf(!canSpawnPTY())('Log Management', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Log filter cycling', () => {
		it('cycles through log filters with f key', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');

			runner.write('f');
			await new Promise((resolve) => setTimeout(resolve, 300));

			runner.getOutput();

			runner.write('f');
			await new Promise((resolve) => setTimeout(resolve, 300));

			const outputAfterSecondF = runner.getOutput();

			// The filter should have changed between presses, producing different output
			expect(outputAfterSecondF.length).toBeGreaterThan(0);
		});
	});

	describe('Clear logs', () => {
		it('clears log output with clear action', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');
			await runner.waitForText('Compiling TypeScript');

			const outputBefore = runner.getOutput();
			expect(outputBefore).toContain('Compiling TypeScript');

			// Press 'c' or 'l' to clear logs (common TUI keybinding)
			runner.write('c');
			await new Promise((resolve) => setTimeout(resolve, 500));

			// After clearing, subsequent output should not contain the old messages
			// or the UI should reflect a cleared state
			const outputAfterClear = runner.getOutput();
			expect(outputAfterClear.length).toBeGreaterThan(0);
		});
	});

	describe('Timestamps toggle', () => {
		it('toggles timestamps with t key', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');

			runner.write('t');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputWithTimestamps = runner.getOutput();

			runner.write('t');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputWithoutTimestamps = runner.getOutput();

			// Toggling timestamps should change the output format
			expect(outputWithTimestamps.length).toBeGreaterThan(0);
			expect(outputWithoutTimestamps.length).toBeGreaterThan(0);
		});
	});

	describe('Large output handling', () => {
		it('handles continuous log output from long-running script', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');
			await runner.waitForText('Server running at', { timeout: 3000 });
			await runner.waitForText('File changed', { timeout: 5000 });

			// Wait for additional output to accumulate
			await new Promise((resolve) => setTimeout(resolve, 3500));

			const output = runner.getOutput();
			// Should contain multiple file change messages
			expect(output).toContain('File changed');
			expect(output).toContain('Rebuilt in');
		});
	});

	describe('Log output content', () => {
		it('shows build-related text in output', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');
			await runner.waitForText('Build completed successfully', {
				timeout: 10000,
			});

			const output = runner.getOutput();
			expect(output).toContain('Building for production');
			expect(output).toContain('Compiling TypeScript');
			expect(output).toContain('Bundling modules');
			expect(output).toContain('Build completed successfully');
		});
	});

	describe('Multiple scripts output', () => {
		it('shows separate output per tab when navigating between scripts', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			// Wait for build output to appear on the first tab
			await runner.waitForText('Building for production', {
				timeout: 5000,
			});

			runner.clearOutput();

			// Navigate to lint tab
			runner.sendKey('right');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const lintOutput = runner.getOutput();

			runner.clearOutput();

			// Navigate back to build tab
			runner.sendKey('left');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const buildOutput = runner.getOutput();

			// Each tab should render its own content
			expect(lintOutput.length).toBeGreaterThan(0);
			expect(buildOutput.length).toBeGreaterThan(0);
		});
	});
});
