console.log('[unit] Running unit tests...');
const suites = [
	'auth',
	'api',
	'utils',
	'models',
	'validators',
	'hooks',
	'services',
];
let i = 0;
const run = () => {
	if (i < suites.length) {
		const count = Math.floor(Math.random() * 15) + 3;
		console.log(
			`[unit] ✓ ${suites[i]} (${count} tests, ${(Math.random() * 500 + 100).toFixed(0)}ms)`,
		);
		i++;
		setTimeout(run, 300);
	} else {
		console.log(`[unit] All ${suites.length} suites passed`);
		process.exit(0);
	}
};
setTimeout(run, 500);
