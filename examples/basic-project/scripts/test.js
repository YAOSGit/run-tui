#!/usr/bin/env node

// Simulates test runner output
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	dim: '\x1b[2m',
	bold: '\x1b[1m',
	cyan: '\x1b[36m',
};

const testSuites = [
	{
		name: 'components/Button.test.ts',
		tests: [
			{ name: 'renders correctly', pass: true, time: 12 },
			{ name: 'handles click events', pass: true, time: 8 },
			{ name: 'applies custom styles', pass: true, time: 5 },
		],
	},
	{
		name: 'utils/helpers.test.ts',
		tests: [
			{ name: 'formats dates correctly', pass: true, time: 3 },
			{ name: 'parses JSON safely', pass: true, time: 2 },
			{ name: 'handles edge cases', pass: true, time: 15 },
		],
	},
	{
		name: 'hooks/useAuth.test.ts',
		tests: [
			{ name: 'initializes with null user', pass: true, time: 4 },
			{ name: 'handles login flow', pass: true, time: 45 },
			{ name: 'handles logout', pass: true, time: 6 },
		],
	},
];

console.log(`\n${colors.cyan}${colors.bold} RUNNING TESTS ${colors.reset}\n`);

let suiteIndex = 0;
let testIndex = 0;
let passed = 0;
let failed = 0;

function runNextTest() {
	if (suiteIndex >= testSuites.length) {
		// Summary
		console.log(`\n${colors.bold}Test Suites:${colors.reset} ${colors.green}${testSuites.length} passed${colors.reset}, ${testSuites.length} total`);
		console.log(`${colors.bold}Tests:${colors.reset}       ${colors.green}${passed} passed${colors.reset}, ${passed + failed} total`);
		console.log(`${colors.dim}Time:        ${((passed + failed) * 0.015).toFixed(2)}s${colors.reset}\n`);
		process.exit(failed > 0 ? 1 : 0);
		return;
	}

	const suite = testSuites[suiteIndex];

	if (testIndex === 0) {
		console.log(`${colors.bold} ${suite.name}${colors.reset}`);
	}

	const test = suite.tests[testIndex];

	setTimeout(() => {
		if (test.pass) {
			console.log(`   ${colors.green}✓${colors.reset} ${colors.dim}${test.name} (${test.time}ms)${colors.reset}`);
			passed++;
		} else {
			console.log(`   ${colors.red}✕${colors.reset} ${test.name} (${test.time}ms)`);
			failed++;
		}

		testIndex++;
		if (testIndex >= suite.tests.length) {
			console.log('');
			suiteIndex++;
			testIndex = 0;
		}

		runNextTest();
	}, test.time + 50);
}

setTimeout(runNextTest, 500);
