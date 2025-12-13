#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { render } from 'ink';
import App from './components/App/index.js';
import type { PackageManager } from './types/PackageManager/index.js';

// Version is injected at build time by esbuild
declare const __CLI_VERSION__: string;

const program = new Command();

const PACKAGE_MANAGERS: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

// read package.json from the current working directory
const cwd = process.cwd();
const packageJsonPath = path.join(cwd, 'package.json');

let packageJson: { scripts?: Record<string, string> };
try {
	const data = fs.readFileSync(packageJsonPath, 'utf-8');
	packageJson = JSON.parse(data);
} catch {
	console.error('Could not read package.json in current directory.');
	process.exit(1);
}

const availableScripts = Object.keys(packageJson.scripts || {});

program
	.name('run-tui')
	.description('Run node scripts concurrently with an interactive TUI')
	.version(__CLI_VERSION__, '-v, --version', 'Display version information')
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
	.option('-H, --height <lines>', 'Height of the log view in lines', '20')
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
				height: string;
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
				requestedScripts = scripts;
			}

			const height = parseInt(options.height, 10);

			render(
				<App
					tasks={requestedScripts}
					packageManager={pm as PackageManager}
					availableScripts={availableScripts}
					keepAlive={options.keepAlive ?? false}
					height={height}
				/>,
			);
		},
	);

program.parse();
