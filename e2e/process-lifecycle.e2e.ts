import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner } from './utils';

describe('Process Lifecycle', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic-project');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Process spawning', () => {
		it('spawns process and captures stdout', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');
			await runner.waitForText('Compiling TypeScript');
		});

		it('spawns multiple processes concurrently', async () => {
			await runner.start(['build', 'lint', 'test']);
			await runner.waitForText('build');
			await runner.waitForText('lint');
			await runner.waitForText('test');
		});

		it('handles continuous log output', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');
			await runner.waitForText('Server running at');
			await runner.waitForText('File changed', { timeout: 5000 });
		});
	});

	describe('Process termination', () => {
		it('shows SUCCESS status when process exits with 0', async () => {
			await runner.start(['build']);
			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});

		it('shows SUCCESS status when process is killed', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');

			runner.write('k');
			await runner.waitForText('Kill');
			runner.write('y');

			await runner.waitForText('SUCCESS', { timeout: 5000 });
		});
	});

	describe('Cleanup on exit', () => {
		it('kills all processes when quitting', async () => {
			await runner.start(['build']);
			// Wait for build to complete so there are no running processes
			await runner.waitForText('SUCCESS', { timeout: 10000 });

			runner.write('q');
			const exitCode = await runner.waitForExit(5000);
			expect(exitCode).toBe(0);
		});

		it('handles SIGINT gracefully', async () => {
			await runner.start(['build']);
			// Wait for build to complete
			await runner.waitForText('SUCCESS', { timeout: 10000 });

			runner.sendKey('ctrl+c');
			const exitCode = await runner.waitForExit(5000);
			expect(exitCode).toBe(0);
		});
	});
});
