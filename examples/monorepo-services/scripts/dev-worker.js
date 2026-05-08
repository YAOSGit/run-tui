// Simulates a background worker
console.log('[worker] Starting background worker...');
let jobs = 0;
const interval = setInterval(() => {
	jobs++;
	const types = ['email', 'notification', 'sync', 'cleanup', 'report'];
	const type = types[Math.floor(Math.random() * types.length)];
	console.log(`[worker] Processing job #${jobs}: ${type}`);
	if (jobs % 10 === 0) console.log(`[worker] ${jobs} jobs processed`);
}, 1500);
process.on('SIGTERM', () => {
	clearInterval(interval);
	console.log('[worker] Draining queue...');
	process.exit(0);
});
process.on('SIGINT', () => {
	clearInterval(interval);
	process.exit(0);
});
