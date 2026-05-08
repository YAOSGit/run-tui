// Simulates type checking
console.log('[typecheck] Running TypeScript compiler...');
setTimeout(() => {
	console.log('[typecheck] Checking 123 source files...');
	setTimeout(() => {
		console.log('[typecheck] No type errors found');
		process.exit(0);
	}, 1000);
}, 500);
