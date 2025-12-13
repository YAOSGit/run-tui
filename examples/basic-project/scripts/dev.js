#!/usr/bin/env node

// Simulates a development server with watch mode
const colors = {
	reset: '\x1b[0m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	dim: '\x1b[2m',
};

console.log(`${colors.cyan}Starting development server...${colors.reset}`);

setTimeout(() => {
	console.log(`${colors.green}✓${colors.reset} Server running at http://localhost:3000`);
	console.log(`${colors.dim}Watching for file changes...${colors.reset}\n`);
}, 500);

let changeCount = 0;
const files = ['src/App.tsx', 'src/components/Button.tsx', 'src/utils/helpers.ts', 'src/styles/main.css'];

setInterval(() => {
	const file = files[changeCount % files.length];
	console.log(`${colors.yellow}⟳${colors.reset} ${colors.dim}[${new Date().toLocaleTimeString()}]${colors.reset} File changed: ${file}`);

	setTimeout(() => {
		console.log(`${colors.green}✓${colors.reset} Rebuilt in ${Math.floor(Math.random() * 100 + 50)}ms\n`);
	}, 200);

	changeCount++;
}, 3000);
