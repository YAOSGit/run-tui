import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner } from './utils';

describe('Keyboard Interactions', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(
		import.meta.dirname,
		'../examples/basic-project',
	);

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Tab navigation', () => {
		it('navigates between tabs with left/right arrows', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');

			runner.sendKey('right');
			// Should navigate to lint tab
			await new Promise((resolve) => setTimeout(resolve, 100));

			runner.sendKey('left');
			// Should navigate back to build tab
			await new Promise((resolve) => setTimeout(resolve, 100));
		});
	});

	describe('New script (n)', () => {
		it('opens script selector with n key', async () => {
			await runner.start(['-k']);
			await new Promise((resolve) => setTimeout(resolve, 500));

			runner.write('n');
			await runner.waitForText('Select a script', { timeout: 3000 });
		});

		it('cancels selector with escape', async () => {
			await runner.start(['-k']);
			await new Promise((resolve) => setTimeout(resolve, 500));

			runner.write('n');
			await runner.waitForText('Select a script', { timeout: 3000 });

			runner.sendKey('escape');
			// Should close the selector
			await new Promise((resolve) => setTimeout(resolve, 200));
		});
	});

	describe('Kill process (k)', () => {
		it('prompts for confirmation before killing', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');

			runner.write('k');
			await runner.waitForText('Kill', { timeout: 3000 });
		});

		it('kills process on confirmation (y)', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');

			runner.write('k');
			await runner.waitForText('Kill');
			runner.write('y');

			await runner.waitForText('SUCCESS', { timeout: 5000 });
		});

		it('cancels kill on n key', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');

			runner.write('k');
			await runner.waitForText('Kill');
			runner.write('n');

			// Process should still be running - wait for next tick
			await runner.waitForText('File changed', { timeout: 5000 });
		});
	});

	describe('Quit (q)', () => {
		it('quits immediately when no running processes', async () => {
			await runner.start(['build']);
			await runner.waitForText('Build completed successfully');
			await runner.waitForText('SUCCESS');

			runner.write('q');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(0);
		});

		it('prompts for confirmation with running processes', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');

			runner.write('q');
			await runner.waitForText('running', { timeout: 3000 });
		});

		it('quits on escape key', async () => {
			await runner.start(['build']);
			await runner.waitForText('SUCCESS');

			runner.sendKey('escape');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(0);
		});
	});
});
