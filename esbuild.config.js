import { createEsbuildConfig } from '@yaos-git/toolkit/build';
import * as esbuild from 'esbuild';

await esbuild.build({
	...createEsbuildConfig({
		entry: 'src/app/cli.tsx',
	}),
	outfile: 'dist/tui.js',
});
