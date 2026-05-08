#!/usr/bin/env node

// Simulates a build process that completes
const colors = {
	reset: '\x1b[0m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	dim: '\x1b[2m',
	bold: '\x1b[1m',
};

const steps = [
	{ msg: 'Cleaning dist folder...', delay: 300 },
	{ msg: 'Compiling TypeScript...', delay: 800 },
	{ msg: 'Bundling modules...', delay: 600 },
	{ msg: 'Optimizing assets...', delay: 400 },
	{ msg: 'Minifying output...', delay: 500 },
	{ msg: 'Generating source maps...', delay: 300 },
];

console.log(
	`\n${colors.cyan}${colors.bold}Building for production...${colors.reset}\n`,
);

let currentStep = 0;

function runStep() {
	if (currentStep >= steps.length) {
		console.log(
			`\n${colors.green}${colors.bold}✓ Build completed successfully!${colors.reset}`,
		);
		console.log(
			`${colors.dim}  Output: dist/bundle.js (245 KB)${colors.reset}`,
		);
		console.log(
			`${colors.dim}  Time: ${(steps.reduce((a, s) => a + s.delay, 0) / 1000).toFixed(2)}s${colors.reset}\n`,
		);
		process.exit(0);
		return;
	}

	const step = steps[currentStep];
	process.stdout.write(`${colors.yellow}○${colors.reset} ${step.msg}`);

	setTimeout(() => {
		process.stdout.write(`\r${colors.green}✓${colors.reset} ${step.msg}\n`);
		currentStep++;
		runStep();
	}, step.delay);
}

runStep();
