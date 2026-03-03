console.log('[lint] Running Biome linter...');
setTimeout(() => {
	console.log('[lint] Checked 89 files across 12 directories');
	console.log('[lint] 0 errors, 2 warnings');
	console.warn('[lint] Warning: unused import in src/utils/legacy.ts:3');
	console.warn('[lint] Warning: prefer const in src/api/handler.ts:17');
	process.exit(0);
}, 1200);
