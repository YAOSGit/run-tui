console.log('[storybook] Starting Storybook on port 6006...');
setTimeout(() => {
	console.log('[storybook] Storybook ready at http://localhost:6006');
	const interval = setInterval(() => {
		console.log('[storybook] Watching for component changes...');
	}, 5000);
	process.on('SIGTERM', () => {
		clearInterval(interval);
		process.exit(0);
	});
	process.on('SIGINT', () => {
		clearInterval(interval);
		process.exit(0);
	});
}, 3000);
