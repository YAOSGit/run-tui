import type { PackageManager } from '../../types/PackageManager/index.js';

export interface AppProps {
	tasks: string[];
	packageManager: PackageManager;
}

export type KeyCommand = {
	textKey?: string;
	specialKey?: string;
	ctrl?: boolean;
	shift?: boolean;
	meta?: boolean;
};
