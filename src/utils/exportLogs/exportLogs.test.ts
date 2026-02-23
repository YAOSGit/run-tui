import { describe, expect, it } from 'vitest';
import type { LogEntry } from '../../types/LogEntry/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { formatLogsAsText } from './index.js';

const makeEntry = (overrides: Partial<LogEntry> = {}): LogEntry => ({
	id: '1',
	task: 'build',
	text: 'hello',
	type: LOG_TYPE.STDOUT,
	timestamp: '12:00:00',
	...overrides,
});

describe('formatLogsAsText', () => {
	it('returns empty string for empty array', () => {
		expect(formatLogsAsText([])).toBe('');
	});

	it('formats a stdout entry as [timestamp] text', () => {
		const logs = [makeEntry({ text: 'Build started', timestamp: '10:00:00' })];
		expect(formatLogsAsText(logs)).toBe('[10:00:00] Build started');
	});

	it('formats a stderr entry as [timestamp] text', () => {
		const logs = [
			makeEntry({
				text: 'Error!',
				type: LOG_TYPE.STDERR,
				timestamp: '10:01:00',
			}),
		];
		expect(formatLogsAsText(logs)).toBe('[10:01:00] Error!');
	});

	it('skips divider entries', () => {
		const logs = [
			makeEntry({ text: 'before', timestamp: '10:00:00' }),
			makeEntry({ text: '─── restart ───', type: LOG_TYPE.DIVIDER }),
			makeEntry({ text: 'after', timestamp: '10:01:00' }),
		];
		expect(formatLogsAsText(logs)).toBe('[10:00:00] before\n[10:01:00] after');
	});

	it('joins multiple entries with newlines', () => {
		const logs = [
			makeEntry({ text: 'line 1', timestamp: '10:00:00' }),
			makeEntry({ text: 'line 2', timestamp: '10:00:01' }),
			makeEntry({ text: 'line 3', timestamp: '10:00:02' }),
		];
		const result = formatLogsAsText(logs);
		expect(result).toBe(
			'[10:00:00] line 1\n[10:00:01] line 2\n[10:00:02] line 3',
		);
	});

	it('returns empty string when all entries are dividers', () => {
		const logs = [
			makeEntry({ text: '─── div ───', type: LOG_TYPE.DIVIDER }),
			makeEntry({ text: '─── div ───', type: LOG_TYPE.DIVIDER }),
		];
		expect(formatLogsAsText(logs)).toBe('');
	});
});
