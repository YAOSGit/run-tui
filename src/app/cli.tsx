#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { render } from 'ink';
import type { PackageManager } from '../types/PackageManager/index.js';
import type { RestartConfig } from '../types/RestartConfig/index.js';
import App from './index.js';

// Version is injected at build time by esbuild
declare const __CLI_VERSION__: string;

const program = new Command();

const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

// read package.json from the current working directory
const cwd = process.cwd();
const packageJsonPath = path.join(cwd, 'package.json');

let packageJson: { scripts?: Record<string, string> };

if (!fs.existsSync(packageJsonPath)) {
	console.error('Error: No package.json found in current directory.');
	console.error(`Looked in: ${cwd}`);
	console.error(
		'\nMake sure you run this command from a directory with a package.json file.',
	);
	process.exit(2);
}

try {
	const data = fs.readFileSync(packageJsonPath, 'utf-8');
	try {
		packageJson = JSON.parse(data) as { scripts?: Record<string, string> };
	} catch (parseError) {
		console.error('Error: package.json contains invalid JSON.');
		console.error(`Parse error: ${(parseError as Error).message}`);
		process.exit(3);
	}
} catch (readError) {
	if ((readError as NodeJS.ErrnoException).code === 'EACCES') {
		console.error('Error: Permission denied reading package.json.');
		console.error('Check file permissions and try again.');
	} else {
		console.error(
			`Error reading package.json: ${(readError as Error).message}`,
		);
	}
	process.exit(4);
}

const availableScripts = Object.keys(packageJson.scripts ?? {});

if (availableScripts.length === 0) {
	console.error('Warning: No scripts found in package.json.');
}

const versionInfo = [
	`run-tui v${__CLI_VERSION__}`,
	`Node.js ${process.version}`,
	`Platform: ${process.platform} ${process.arch}`,
].join('\n');

program
	.name('run-tui')
	.description('Run node scripts concurrently with an interactive TUI')
	.version(versionInfo, '-v, --version', 'Display version information')
	.argument('[scripts...]', 'Script names or regex patterns to run')
	.option('-r, --regex', 'Treat arguments as regex patterns')
	.option(
		'-p, --package-manager <pm>',
		`Package manager to use (${PACKAGE_MANAGERS.join(', ')})`,
		'npm',
	)
	.option(
		'-k, --keep-alive',
		'Keep TUI open even with no scripts (allows adding scripts with "n" key)',
	)
	.option('-H, --height <lines>', 'Height of the log view in lines')
	.option(
		'--restart-on-failure',
		'Automatically restart tasks when they fail (exit code !== 0)',
		false,
	)
	.option(
		'--restart-delay <ms>',
		'Delay in milliseconds before restarting a failed task',
		'2000',
	)
	.option(
		'--max-restarts <count>',
		'Maximum number of restart attempts per task',
		'3',
	)
	.option(
		'--restart-codes <codes>',
		'Comma-separated list of exit codes to restrict restarts to (e.g. "1,137")',
	)
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
				height?: string;
				restartOnFailure: boolean;
				restartDelay: string;
				maxRestarts: string;
				restartCodes?: string;
			},
		) => {
			if (scripts.length === 0 && !options.keepAlive) {
				program.help();
			}

			const pm = options.packageManager.toLowerCase();
			if (!PACKAGE_MANAGERS.includes(pm as PackageManager)) {
				console.error(
					`Error: Invalid package manager "${options.packageManager}". Must be one of: ${PACKAGE_MANAGERS.join(', ')}`,
				);
				process.exit(1);
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
					console.error(
						`Error: Invalid regex pattern(s): ${invalidPatterns.join(', ')}`,
					);
					process.exit(1);
				}

				requestedScripts = Array.from(matchedScripts);

				if (requestedScripts.length === 0 && !options.keepAlive) {
					console.error('Error: No scripts matched the provided pattern(s).');
					console.log('\nAvailable scripts:');
					for (const s of availableScripts) {
						console.log(`  - ${s}`);
					}
					process.exit(1);
				}
			} else {
				const missingScripts = scripts.filter(
					(s) => !availableScripts.includes(s),
				);
				if (missingScripts.length > 0) {
					console.error(
						`Error: The following scripts are missing from package.json: ${missingScripts.join(', ')}`,
					);
					process.exit(1);
				}

				// Support duplicate tabs intentionally by not using `Set` reductions
				requestedScripts = scripts;
			}

			const height = options.height ? parseInt(options.height, 10) : undefined;

			let exitCodes: number[] | undefined;
			if (options.restartCodes) {
				exitCodes = options.restartCodes
					.split(',')
					.map((c) => parseInt(c.trim(), 10))
					.filter((c) => !Number.isNaN(c));
			}

			const restartConfig: RestartConfig = {
				enabled: options.restartOnFailure,
				delayMs: parseInt(options.restartDelay, 10),
				maxAttempts: parseInt(options.maxRestarts, 10),
				exitCodes,
			};

			render(
				<App
					tasks={requestedScripts}
					packageManager={pm as PackageManager}
					availableScripts={availableScripts}
					keepAlive={options.keepAlive ?? false}
					height={height}
					restartConfig={restartConfig}
					scriptArgs={scriptArgs}
				/>,
			);
		},
	);

// Intercept '--' before commander processes it
const dashDashIndex = process.argv.indexOf('--');
let appArgv = process.argv;
let scriptArgs: string[] = [];

if (dashDashIndex !== -1) {
	appArgv = process.argv.slice(0, dashDashIndex);
	scriptArgs = process.argv.slice(dashDashIndex + 1);
}

program.parse(appArgv);
