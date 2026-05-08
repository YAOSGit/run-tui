// Simulates a dev server with periodic output
let tick = 0;
const interval = setInterval(() => {
	tick++;
	console.log(
		`[dev] Server running on http://localhost:3000 (uptime: ${tick}s)`,
	);
	if (tick % 5 === 0) console.log('[dev] Hot module replacement active');
}, 1000);
process.on('SIGTERM', () => {
	clearInterval(interval);
	process.exit(0);
});
process.on('SIGINT', () => {
	clearInterval(interval);
	process.exit(0);
});
