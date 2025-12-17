import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PTYRunner } from './utils';

describe('CLI Argument Parsing', () => {
	let runner: PTYRunner;
	const fixturesPath = path.resolve(import.meta.dirname, '../examples/basic-project');

	beforeEach(() => {
		runner = new PTYRunner({ cwd: fixturesPath });
	});

	afterEach(async () => {
		await runner.cleanup();
	});

	describe('Script name arguments', () => {
		it('runs a single script by name', async () => {
			await runner.start(['build']);
			await runner.waitForText('Building for production');
			await runner.waitForText('Build completed successfully');
		});

		it('runs multiple scripts by name', async () => {
			await runner.start(['build', 'lint']);
			await runner.waitForText('build');
			await runner.waitForText('lint');
		});

		it('shows error for non-existent script', async () => {
			await runner.start(['nonexistent']);
			await runner.waitForText('missing from package.json');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(1);
		});
	});

	describe('Regex pattern matching (-r)', () => {
		it('shows error for invalid regex', async () => {
			await runner.start(['-r', '[invalid']);
			await runner.waitForText('Invalid regex');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(1);
		});

		it('shows error when no scripts match pattern', async () => {
			await runner.start(['-r', 'nonexistent']);
			await runner.waitForText('No scripts matched');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(1);
		});
	});

	describe('Package manager selection (-p)', () => {
		it('defaults to npm', async () => {
			await runner.start(['build']);
			await runner.waitForText('Build completed successfully');
		});

		it('rejects invalid package manager', async () => {
			await runner.start(['-p', 'invalid', 'build']);
			await runner.waitForText('Invalid package manager');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(1);
		});
	});

	describe('Keep-alive mode (-k)', () => {
		it('allows starting with no scripts when -k is set', async () => {
			await runner.start(['-k']);
			// Should not exit, TUI should be running
			await runner.waitForText('n', { timeout: 3000 });
		});
	});

	describe('Help and version', () => {
		it('shows help with --help', async () => {
			await runner.start(['--help']);
			await runner.waitForText('Usage:');
			await runner.waitForText('run-tui');
			await runner.waitForText('Available scripts');
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(0);
		});

		it('shows version with --version', async () => {
			await runner.start(['--version']);
			await runner.waitForPattern(/\d+\.\d+\.\d+/);
			const exitCode = await runner.waitForExit();
			expect(exitCode).toBe(0);
		});
	});
});
