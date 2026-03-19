#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Option } from 'commander';
import { render } from 'ink';
import { createCLI, runIfMain } from '@yaos-git/toolkit/cli';
import { fatalError, formatError, getExitCode } from '@yaos-git/toolkit/cli';
import type { PackageManager } from '../types/PackageManager/index.js';
import type { RestartConfig } from '../types/RestartConfig/index.js';
import { App } from './index.js';

// Version is injected at build time by esbuild
declare const __CLI_VERSION__: string;

async function runTUI(args: string[] = process.argv.slice(2)): Promise<void> {
	const dashDashIndex = args.indexOf('--');
	let commanderArgs = args;
	let scriptArgs: string[] = [];
	if (dashDashIndex !== -1) {
		commanderArgs = args.slice(0, dashDashIndex);
		scriptArgs = args.slice(dashDashIndex + 1);
	}

	const { program } = createCLI({
		name: 'run-tui',
		description: 'Run node scripts concurrently with an interactive TUI',
		version: __CLI_VERSION__,
	});

	const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

	// read package.json from the current working directory
	const cwd = process.cwd();
	const packageJsonPath = path.join(cwd, 'package.json');

	let packageJson: { scripts?: Record<string, string> } = {};

	if (!fs.existsSync(packageJsonPath)) {
		fatalError(
			`No package.json found in current directory.\nLooked in: ${cwd}\n\nMake sure you run this command from a directory with a package.json file.`,
		);
		process.exitCode = 2;
	}

	try {
		const data = fs.readFileSync(packageJsonPath, 'utf-8');
		try {
			packageJson = JSON.parse(data) as { scripts?: Record<string, string> };
		} catch (parseError) {
			fatalError(
				`package.json contains invalid JSON.\nParse error: ${formatError(parseError)}`,
			);
			process.exitCode = 3;
		}
	} catch (readError) {
		if (
			readError instanceof Error &&
			(readError as NodeJS.ErrnoException).code === 'EACCES'
		) {
			fatalError(
				'Permission denied reading package.json.\nCheck file permissions and try again.',
			);
		} else {
			fatalError(`Error reading package.json: ${formatError(readError)}`);
		}
		process.exitCode = 4;
	}

	const availableScripts = Object.keys(packageJson.scripts ?? {});

	if (availableScripts.length === 0) {
		console.error('Warning: No scripts found in package.json.');
	}

	program
		.argument('[scripts...]', 'Script names or regex patterns to run')
		.option('-r, --regex', 'Treat arguments as regex patterns')
		.addOption(
			new Option('-p, --package-manager <pm>', `Package manager to use (${PACKAGE_MANAGERS.join(', ')})`)
				.default('npm')
				.choices(PACKAGE_MANAGERS),
		)
		.option('-k, --keep-alive', 'Keep TUI open even with no scripts (allows adding scripts with "n" key)')
		.option('-H, --height <lines>', 'Height of the log view in lines', (v) => parseInt(v, 10))
		.option('--restart-on-failure', 'Automatically restart tasks when they fail (exit code !== 0)', false)
		.option('--restart-delay <ms>', 'Delay in milliseconds before restarting a failed task', (v) => parseInt(v, 10), 2000)
		.option('--max-restarts <count>', 'Maximum number of restart attempts per task', (v) => parseInt(v, 10), 3)
		.option('--restart-codes <codes>', 'Comma-separated list of exit codes to restrict restarts to (e.g. "1,137")')
		.addHelpText(
			'after',
			`\nAvailable scripts:\n${availableScripts.map((s) => `  - ${s}`).join('\n')}`,
		)
		.action(
			(
				scripts: string[],
				options: {
					regex?: boolean;
					packageManager: string;
					keepAlive?: boolean;
					height?: number;
					restartOnFailure: boolean;
					restartDelay: number;
					maxRestarts: number;
					restartCodes?: string;
				},
			) => {
				if (scripts.length === 0 && !options.keepAlive) {
					program.help();
				}

				let requestedScripts: string[];

				if (options.regex) {
					const matchedScripts = new Set<string>();
					const invalidPatterns: string[] = [];

					for (const pattern of scripts) {
						try {
							const regex = new RegExp(pattern);
							const matches = availableScripts.filter((s) => regex.test(s));
							for (const m of matches) {
								matchedScripts.add(m);
							}
						} catch {
							invalidPatterns.push(pattern);
						}
					}

					if (invalidPatterns.length > 0) {
						fatalError(
							`Invalid regex pattern(s): ${invalidPatterns.join(', ')}`,
						);
						return;
					}

					requestedScripts = Array.from(matchedScripts);

					if (requestedScripts.length === 0 && !options.keepAlive) {
						fatalError(
							`No scripts matched the provided pattern(s).\n\nAvailable scripts:\n${availableScripts.map((s) => `  - ${s}`).join('\n')}`,
						);
						return;
					}
				} else {
					const missingScripts = scripts.filter(
						(s) => !availableScripts.includes(s),
					);
					if (missingScripts.length > 0) {
						fatalError(
							`The following scripts are missing from package.json: ${missingScripts.join(', ')}`,
						);
						return;
					}

					// Support duplicate tabs intentionally by not using `Set` reductions
					requestedScripts = scripts;
				}

				let exitCodes: number[] | undefined;
				if (options.restartCodes) {
					exitCodes = options.restartCodes
						.split(',')
						.map((c) => parseInt(c.trim(), 10))
						.filter((c) => !Number.isNaN(c));
				}

				const restartConfig: RestartConfig = {
					enabled: options.restartOnFailure,
					delayMs: options.restartDelay,
					maxAttempts: options.maxRestarts,
					exitCodes,
				};

				render(
					<App
						tasks={requestedScripts}
						packageManager={options.packageManager as PackageManager}
						availableScripts={availableScripts}
						keepAlive={options.keepAlive ?? false}
						height={options.height}
						restartConfig={restartConfig}
						scriptArgs={scriptArgs}
					/>,
				);
			},
		);

	try {
		await program.parseAsync(commanderArgs, { from: 'user' });
	} catch (err) {
		if (err instanceof Error && 'exitCode' in err) {
			process.exitCode = getExitCode(err);
		} else {
			fatalError(formatError(err));
		}
	}
}

runIfMain(import.meta.url, () => { runTUI() });
