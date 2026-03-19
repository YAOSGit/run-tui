import { resolve } from 'node:path';
import { reactConfig } from '@yaos-git/toolkit/build';

const base = reactConfig();

export default {
	...base,
	resolve: {
		alias: {
			react: resolve('node_modules/react'),
			'react-dom': resolve('node_modules/react-dom'),
			ink: resolve('node_modules/ink'),
		},
	},
	test: {
		...base.test,
	},
};
