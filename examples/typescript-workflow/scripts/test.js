// Simulates running tests
console.log('[test] Running test suite...');
const tests = ['auth', 'api', 'utils', 'models', 'middleware'];
let i = 0;
const interval = setInterval(() => {
	if (i < tests.length) {
		const passed = Math.random() > 0.1;
		console.log(
			`[test] ${passed ? '✓' : '✗'} ${tests[i]} (${(Math.random() * 200 + 50).toFixed(0)}ms)`,
		);
		if (!passed) console.error(`[test] FAIL: ${tests[i]} — assertion error`);
		i++;
	} else {
		console.log(`[test] ${tests.length} tests complete`);
		clearInterval(interval);
		process.exit(0);
	}
}, 400);
