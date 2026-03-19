import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner, canSpawnPTY } from './utils';

describe.skipIf(!canSpawnPTY())('Restart and Kill', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Manual restart with r', () => {
		it('restarts a completed script with r key', async () => {
			await runner.start(['build']);
			await runner.waitForText('Build completed successfully', {
				timeout: 10000,
			});
			await runner.waitForText('SUCCESS', { timeout: 10000 });

			runner.clearOutput();

			runner.write('r');

			// After restart, the task state resets — wait for it to complete again
			// The build script runs again from scratch, eventually showing SUCCESS
			await runner.waitForText('SUCCESS', { timeout: 15000 });

			const output = runner.getOutput();
			// Verify the build ran again (some build output should be present)
			expect(output).toBeTruthy();
		});
	});

	describe('Kill with k', () => {
		it('kills a running process with k key', async () => {
			await runner.start(['dev']);
			await runner.waitForText('Starting development server');
			await runner.waitForText('Server running at', { timeout: 3000 });

			runner.write('k');
			await runner.waitForText('Kill', { timeout: 3000 });
			runner.write('y');

			await runner.waitForText('SUCCESS', { timeout: 5000 });
		});
	});

	describe('Kill all with K (shift+k)', () => {
		it('kills all running processes with K key', async () => {
			await runner.start(['dev', 'build']);
			await runner.waitForText('Starting development server', {
				timeout: 5000,
			});

			// Wait a moment for both processes to be up
			await new Promise((resolve) => setTimeout(resolve, 1000));

			runner.write('K');
			await new Promise((resolve) => setTimeout(resolve, 500));

			// May need to confirm the kill-all action
			runner.write('y');

			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});
	});
});
