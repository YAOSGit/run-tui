import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'vitest';
import { PTYRunner } from './utils';

describe('State Transitions', () => {
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

	describe('Task status transitions', () => {
		it('transitions from PENDING to RUNNING to SUCCESS', async () => {
			await runner.start(['build']);

			// Should show PENDING or RUNNING initially
			await runner.waitForPattern(/PENDING|RUNNING/, { timeout: 2000 });

			// Eventually shows SUCCESS
			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});

		it('completes test script with SUCCESS', async () => {
			await runner.start(['test']);

			await runner.waitForText('RUNNING TESTS');
			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});

		it('completes lint script with SUCCESS', async () => {
			await runner.start(['lint']);

			await runner.waitForText('Linting files');
			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});
	});

	describe('Restart transitions', () => {
		it('resets state on restart: SUCCESS -> PENDING -> RUNNING -> SUCCESS', async () => {
			await runner.start(['build']);
			await runner.waitForText('SUCCESS', { timeout: 10000 });

			runner.write('r');

			// Should see PENDING or RUNNING after restart
			await runner.waitForPattern(/PENDING|RUNNING/, { timeout: 3000 });

			// Then success again
			await runner.waitForText('SUCCESS', { timeout: 10000 });
		});
	});

	describe('Multi-task states', () => {
		it('maintains independent state for each task', async () => {
			await runner.start(['build', 'dev']);

			// build should complete quickly
			await runner.waitForText('Build completed successfully', {
				timeout: 10000,
			});

			// Switch to dev tab to see its output
			runner.sendKey('right');
			await new Promise((resolve) => setTimeout(resolve, 200));

			// dev should still be running - look for its startup message or any output
			await runner.waitForPattern(
				/Starting development server|Server running|Watching/,
				{ timeout: 8000 },
			);
		});
	});
});
