// Simulates a build process
console.log('[build] Starting build...');
console.log('[build] Compiling TypeScript...');
setTimeout(() => {
	console.log('[build] Bundling with esbuild...');
	setTimeout(() => {
		console.log('[build] Build complete! (dist/cli.js: 42kb)');
		process.exit(0);
	}, 800);
}, 1200);
