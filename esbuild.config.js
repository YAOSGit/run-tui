import * as esbuild from 'esbuild';
import { createEsbuildConfig } from '@yaos-git/toolkit/build';

await esbuild.build({
	...createEsbuildConfig({
		entry: 'src/app/cli.tsx',
	}),
	outfile: 'dist/tui.js',
});
