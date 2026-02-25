import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { LogEntry } from '../../types/LogEntry/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';

/**
 * Formats log entries as plain text.
 * Divider entries are omitted.
 * Each line: "[HH:MM:SS] text"
 */
export function formatLogsAsText(logs: LogEntry[]): string {
	return logs
		.filter((l) => l.type !== LOG_TYPE.DIVIDER)
		.map((l) => `[${l.timestamp}] ${l.text}`)
		.join('\n');
}

/**
 * Writes formatted log text to ./logs/<taskName>-<timestamp>.log
 * Creates the logs directory if it doesn't exist.
 * Returns the path of the written file.
 */
export async function saveLogsToFile(
	taskName: string,
	text: string,
): Promise<string> {
	const logsDir = path.join(process.cwd(), 'logs');
	await fs.promises.mkdir(logsDir, { recursive: true });

	const now = new Date();
	const timestamp = now
		.toISOString()
		.replace(/[:.]/g, '-')
		.replace('T', '-')
		.slice(0, 19);

	// Sanitize task name for use in filename
	const safeName = taskName.replace(/[^a-zA-Z0-9_-]/g, '_');
	const filename = `${safeName}-${timestamp}.log`;
	const filepath = path.join(logsDir, filename);

	await fs.promises.writeFile(filepath, text, 'utf-8');
	return filepath;
}

/**
 * Copies text to the system clipboard.
 * Supports macOS (pbcopy), Linux (xclip/xsel), Windows (clip).
 */
export async function copyToClipboard(text: string): Promise<void> {
	const platform = process.platform;

	if (platform === 'darwin') {
		const proc = exec('pbcopy');
		proc.stdin?.write(text);
		proc.stdin?.end();
		await new Promise<void>((resolve, reject) => {
			proc.on('close', (code) => {
				if (code === 0) resolve();
				else reject(new Error(`pbcopy exited with code ${code}`));
			});
		});
	} else if (platform === 'linux') {
		// Try xclip first, fall back to xsel
		try {
			const proc = exec('xclip -selection clipboard');
			proc.stdin?.write(text);
			proc.stdin?.end();
			await new Promise<void>((resolve, reject) => {
				proc.on('close', (code) => {
					if (code === 0) resolve();
					else reject(new Error(`xclip exited with code ${code}`));
				});
			});
		} catch {
			const proc = exec('xsel --clipboard --input');
			proc.stdin?.write(text);
			proc.stdin?.end();
			await new Promise<void>((resolve, reject) => {
				proc.on('close', (code) => {
					if (code === 0) resolve();
					else reject(new Error(`xsel exited with code ${code}`));
				});
			});
		}
	} else if (platform === 'win32') {
		const proc = exec('clip');
		proc.stdin?.write(text);
		proc.stdin?.end();
		await new Promise<void>((resolve, reject) => {
			proc.on('close', (code) => {
				if (code === 0) resolve();
				else reject(new Error(`clip exited with code ${code}`));
			});
		});
	} else {
		throw new Error(`Clipboard not supported on platform: ${platform}`);
	}
}
