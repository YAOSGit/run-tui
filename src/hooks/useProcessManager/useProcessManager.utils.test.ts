import { describe, expect, it } from 'vitest';
import {
	getCommand,
	stripControlSequences,
} from './useProcessManager.utils.js';

describe('getCommand', () => {
	it('returns npm for npm package manager on non-windows', () => {
		expect(getCommand('npm')).toBe('npm');
	});

	it('returns pnpm for pnpm package manager on non-windows', () => {
		expect(getCommand('pnpm')).toBe('pnpm');
	});

	it('returns yarn for yarn package manager on non-windows', () => {
		expect(getCommand('yarn')).toBe('yarn');
	});

	it('returns bun for bun package manager on non-windows', () => {
		expect(getCommand('bun')).toBe('bun');
	});
});

describe('stripControlSequences', () => {
	it('returns plain text unchanged', () => {
		expect(stripControlSequences('Hello World')).toBe('Hello World');
	});

	it('removes clear screen sequence', () => {
		expect(stripControlSequences('\x1b[2JHello')).toBe('Hello');
	});

	it('removes cursor home sequence', () => {
		expect(stripControlSequences('\x1b[HHello')).toBe('Hello');
	});

	it('removes cursor position sequences', () => {
		expect(stripControlSequences('\x1b[10;20HHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[5;10fHello')).toBe('Hello');
	});

	it('removes cursor movement sequences', () => {
		expect(stripControlSequences('\x1b[5AHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[3BHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[2CHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[4DHello')).toBe('Hello');
	});

	it('removes cursor save/restore sequences', () => {
		expect(stripControlSequences('\x1b[sHello\x1b[u')).toBe('Hello');
	});

	it('removes erase in line sequences', () => {
		expect(stripControlSequences('\x1b[KHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[2KHello')).toBe('Hello');
	});

	it('removes erase in display sequences', () => {
		expect(stripControlSequences('\x1b[JHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[2JHello')).toBe('Hello');
	});

	it('removes scroll sequences', () => {
		expect(stripControlSequences('\x1b[5SHello')).toBe('Hello');
		expect(stripControlSequences('\x1b[3THello')).toBe('Hello');
	});

	it('removes alternate screen buffer sequences', () => {
		expect(stripControlSequences('\x1b[?1049hHello\x1b[?1049l')).toBe('Hello');
		expect(stripControlSequences('\x1b[?47hHello\x1b[?47l')).toBe('Hello');
	});

	it('removes cursor visibility sequences', () => {
		expect(stripControlSequences('\x1b[?25hHello\x1b[?25l')).toBe('Hello');
	});

	it('removes carriage returns', () => {
		expect(stripControlSequences('Hello\rWorld')).toBe('HelloWorld');
	});

	it('handles multiple control sequences', () => {
		const input = '\x1b[2J\x1b[H\x1b[?25lHello World\x1b[?25h';
		expect(stripControlSequences(input)).toBe('Hello World');
	});

	it('preserves ANSI color codes', () => {
		// Color codes should NOT be stripped - they're used for styling
		const input = '\x1b[31mRed Text\x1b[0m';
		expect(stripControlSequences(input)).toBe('\x1b[31mRed Text\x1b[0m');
	});

	it('handles empty string', () => {
		expect(stripControlSequences('')).toBe('');
	});

	it('handles string with only control sequences', () => {
		expect(stripControlSequences('\x1b[2J\x1b[H\r')).toBe('');
	});
});
