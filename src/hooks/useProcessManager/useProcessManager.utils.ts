// biome-ignore-all lint/suspicious/noControlCharactersInRegex: this is specific for terminal control sequences
import type { PackageManager } from '../../types/PackageManager/index.js';
import { PACKAGE_MANAGER } from '../../types/PackageManager/index.js';

export const getCommand = (pm: PackageManager): string => {
	if (process.platform === 'win32') {
		switch (pm) {
			case PACKAGE_MANAGER.NPM:
				return 'npm.cmd';
			case PACKAGE_MANAGER.YARN:
				return 'yarn.cmd';
			case PACKAGE_MANAGER.PNPM:
				return 'pnpm.cmd';
			case PACKAGE_MANAGER.BUN:
				return 'bun.exe';
			default:
				return pm;
		}
	}
	return pm;
};

export const stripControlSequences = (text: string): string => {
	return (
		text
			// Remove clear screen sequences
			.replace(/\x1b\[2J/g, '')
			// Remove cursor home/position sequences
			.replace(/\x1b\[H/g, '')
			.replace(/\x1b\[\d*;\d*H/g, '')
			.replace(/\x1b\[\d*;\d*f/g, '')
			// Remove cursor movement (up, down, forward, back)
			.replace(/\x1b\[\d*[ABCD]/g, '')
			// Remove cursor save/restore
			.replace(/\x1b\[s/g, '')
			.replace(/\x1b\[u/g, '')
			// Remove erase in line/display
			.replace(/\x1b\[K/g, '')
			.replace(/\x1b\[\d*K/g, '')
			.replace(/\x1b\[J/g, '')
			.replace(/\x1b\[\d*J/g, '')
			// Remove scroll sequences
			.replace(/\x1b\[\d*S/g, '')
			.replace(/\x1b\[\d*T/g, '')
			// Remove alternate screen buffer
			.replace(/\x1b\[\?1049[hl]/g, '')
			.replace(/\x1b\[\?47[hl]/g, '')
			// Remove cursor visibility
			.replace(/\x1b\[\?25[hl]/g, '')
			// Remove carriage return that might cause issues
			.replace(/\r/g, '')
	);
};
