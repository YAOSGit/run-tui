#!/usr/bin/env node

// Simulates linting output
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	dim: '\x1b[2m',
	bold: '\x1b[1m',
	cyan: '\x1b[36m',
};

const files = [
	'src/App.tsx',
	'src/components/Button.tsx',
	'src/components/Header.tsx',
	'src/components/Footer.tsx',
	'src/utils/helpers.ts',
	'src/utils/api.ts',
	'src/hooks/useAuth.ts',
	'src/hooks/useTheme.ts',
	'src/styles/theme.ts',
];

console.log(`\n${colors.cyan}${colors.bold}Linting files...${colors.reset}\n`);

let fileIndex = 0;

function lintNextFile() {
	if (fileIndex >= files.length) {
		console.log(
			`\n${colors.green}${colors.bold}✓ All files passed linting${colors.reset}`,
		);
		console.log(
			`${colors.dim}  ${files.length} files checked${colors.reset}\n`,
		);
		process.exit(0);
		return;
	}

	const file = files[fileIndex];
	process.stdout.write(`${colors.dim}Checking ${file}...${colors.reset}`);

	setTimeout(
		() => {
			process.stdout.write(
				`\r${colors.green}✓${colors.reset} ${file}${' '.repeat(30)}\n`,
			);
			fileIndex++;
			lintNextFile();
		},
		Math.random() * 100 + 50,
	);
}

lintNextFile();
