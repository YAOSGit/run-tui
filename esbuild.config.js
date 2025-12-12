import * as esbuild from 'esbuild';
import { builtinModules } from 'node:module';

const requireShim = `
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
`;

await esbuild.build({
	entryPoints: ['src/cli.tsx'],
	bundle: true,
	platform: 'node',
	format: 'esm',
	outfile: 'dist/cli.js',
	minify: true,
	external: builtinModules.map((m) => `node:${m}`),
	banner: {
		js: requireShim,
	},
	supported: {
		'top-level-await': true,
	},
	plugins: [
		{
			name: 'node-builtins-to-node-prefix',
			setup(build) {
				const filter = new RegExp(`^(${builtinModules.join('|')})$`);
				build.onResolve({ filter }, (args) => ({
					path: `node:${args.path}`,
					external: true,
				}));
			},
		},
		{
			name: 'stub-react-devtools',
			setup(build) {
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
