import * as esbuild from 'esbuild';

await esbuild.build({
	entryPoints: ['src/cli.tsx'],
	bundle: true,
	platform: 'node',
	format: 'esm',
	outfile: 'dist/cli.js',
	minify: true,
	packages: 'external',
	plugins: [
		{
			name: 'stub-react-devtools',
			setup(build) {
				// Stub out react-devtools-core since it's optional and not needed in production
				build.onResolve({ filter: /^react-devtools-core$/ }, () => ({
					path: 'react-devtools-core',
					namespace: 'stub',
				}));
				build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
					contents: 'export default undefined;',
					loader: 'js',
				}));
			},
		},
	],
	mainFields: ['module', 'main'],
	conditions: ['import', 'node'],
});
