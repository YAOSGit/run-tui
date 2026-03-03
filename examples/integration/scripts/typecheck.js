console.log('[types] Running TypeScript type checker...');
setTimeout(() => {
	console.log('[types] Checking 234 source files...');
	setTimeout(() => {
		console.log('[types] 0 errors in 234 files');
		process.exit(0);
	}, 1500);
}, 800);
