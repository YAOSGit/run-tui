import { describe, expect, it } from 'vitest';
import { formatDuration } from './index.js';

describe('formatDuration', () => {
	it('formats milliseconds into seconds', () => {
		expect(formatDuration(500)).toBe('0s');
		expect(formatDuration(1500)).toBe('1s');
		expect(formatDuration(45000)).toBe('45s');
	});

	it('formats into minutes and seconds', () => {
		expect(formatDuration(60000)).toBe('1m 0s');
		expect(formatDuration(65000)).toBe('1m 5s');
		expect(formatDuration(125000)).toBe('2m 5s');
	});

	it('formats into hours, minutes, and seconds', () => {
		expect(formatDuration(3600000)).toBe('1h 0m 0s');
		expect(formatDuration(3665000)).toBe('1h 1m 5s');
	});
});
