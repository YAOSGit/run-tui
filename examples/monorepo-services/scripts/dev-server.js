// Simulates an API server
console.log('[server] Starting API server on port 4000...');
let requests = 0;
const interval = setInterval(() => {
	requests++;
	const methods = ['GET', 'POST', 'PUT', 'DELETE'];
	const paths = ['/api/users', '/api/items', '/api/auth', '/api/health'];
	const method = methods[Math.floor(Math.random() * methods.length)];
	const path = paths[Math.floor(Math.random() * paths.length)];
	const status = Math.random() > 0.05 ? 200 : 500;
	console.log(
		`[server] ${method} ${path} → ${status} (${(Math.random() * 100 + 5).toFixed(0)}ms)`,
	);
	if (status === 500)
		console.error(`[server] Internal server error on request #${requests}`);
}, 800);
process.on('SIGTERM', () => {
	clearInterval(interval);
	console.log('[server] Shutting down...');
	process.exit(0);
});
process.on('SIGINT', () => {
	clearInterval(interval);
	process.exit(0);
});
