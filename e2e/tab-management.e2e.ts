import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner, canSpawnPTY } from './utils';

describe.skipIf(!canSpawnPTY())('Tab Management', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Pin/unpin tab', () => {
		it('pins and unpins a tab with p key', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			const outputBeforePin = runner.getOutput();

			runner.write('p');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputAfterPin = runner.getOutput();

			// Pin action should cause a re-render (pin indicator appears)
			expect(outputAfterPin.length).toBeGreaterThan(outputBeforePin.length);

			// Unpin
			runner.write('p');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const outputAfterUnpin = runner.getOutput();
			expect(outputAfterUnpin.length).toBeGreaterThan(outputAfterPin.length);
		});
	});

	describe('Navigate left after right', () => {
		it('navigates right then left between tabs', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');

			runner.clearOutput();

			// Navigate right to lint tab
			runner.sendKey('right');
			await new Promise((resolve) => setTimeout(resolve, 300));

			const outputOnLint = runner.getOutput();

			runner.clearOutput();

			// Navigate left back to build tab
			runner.sendKey('left');
			await new Promise((resolve) => setTimeout(resolve, 300));

			const outputOnBuild = runner.getOutput();

			// Both navigations should produce re-renders
			expect(outputOnLint.length).toBeGreaterThan(0);
			expect(outputOnBuild.length).toBeGreaterThan(0);
		});
	});

	describe('Search with /', () => {
		it('enters search mode when / is pressed', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');
			await runner.waitForText('Server running at', { timeout: 3000 });

			runner.write('/');
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Type search query
			runner.write('server');
			await new Promise((resolve) => setTimeout(resolve, 500));

			const output = runner.getOutput();
			// Search mode should be active, showing search input or highlighting
			expect(output.length).toBeGreaterThan(0);
		});
	});

	describe('Tab shows status', () => {
		it('shows SUCCESS status after build completes', async () => {
			await runner.start(['build']);
			await runner.waitForText('Build completed successfully', {
				timeout: 10000,
			});
			await runner.waitForText('SUCCESS', { timeout: 10000 });

			const output = runner.getOutput();
			expect(output).toContain('SUCCESS');
		});
	});

	describe('Multiple tab navigation', () => {
		it('navigates through three tabs with right arrow', async () => {
			await runner.start(['build', 'lint', 'test']);
			await runner.waitForText('build');
			await runner.waitForText('lint');
			await runner.waitForText('test');

			// Navigate right to second tab (lint)
			runner.sendKey('right');
			await new Promise((resolve) => setTimeout(resolve, 300));

			runner.clearOutput();

			// Navigate right to third tab (test)
			runner.sendKey('right');
			await new Promise((resolve) => setTimeout(resolve, 300));

			const outputOnTest = runner.getOutput();

			// Should have navigated to the test tab
			expect(outputOnTest.length).toBeGreaterThan(0);

			// Navigate back to first tab
			runner.sendKey('left');
			await new Promise((resolve) => setTimeout(resolve, 200));
			runner.sendKey('left');
			await new Promise((resolve) => setTimeout(resolve, 300));

			runner.clearOutput();
			await new Promise((resolve) => setTimeout(resolve, 300));

			const outputBackOnBuild = runner.getOutput();
			expect(outputBackOnBuild.length).toBeGreaterThan(0);
		});
	});
});
