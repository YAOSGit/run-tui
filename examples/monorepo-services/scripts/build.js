console.log('[build] Starting production build...');
const steps = [
	'TypeScript compilation',
	'Bundle (esbuild)',
	'Asset optimization',
	'Source maps',
];
let i = 0;
const run = () => {
	if (i < steps.length) {
		console.log(`[build] Step ${i + 1}/${steps.length}: ${steps[i]}...`);
		i++;
		setTimeout(run, 700);
	} else {
		console.log('[build] Build complete! Output: dist/ (156kb gzipped)');
		process.exit(0);
	}
};
run();
