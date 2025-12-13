import { describe, expect, it, vi } from 'vitest';
import {
	getCommand,
	stripControlSequences,
} from './useProcessManager.utils.js';

describe('useProcessManager.utils', () => {
	describe('getCommand', () => {
		it('returns npm.cmd on Windows for npm', () => {
			vi.stubGlobal('process', { ...process, platform: 'win32' });
			expect(getCommand('npm')).toBe('npm.cmd');
			vi.unstubAllGlobals();
		});

		it('returns package manager name on Windows for non-npm', () => {
			vi.stubGlobal('process', { ...process, platform: 'win32' });
			expect(getCommand('yarn')).toBe('yarn');
			expect(getCommand('pnpm')).toBe('pnpm');
			expect(getCommand('bun')).toBe('bun');
			vi.unstubAllGlobals();
		});

		it('returns package manager name on non-Windows', () => {
			vi.stubGlobal('process', { ...process, platform: 'darwin' });
			expect(getCommand('npm')).toBe('npm');
			expect(getCommand('yarn')).toBe('yarn');
			expect(getCommand('pnpm')).toBe('pnpm');
			expect(getCommand('bun')).toBe('bun');
			vi.unstubAllGlobals();
		});

		it('returns package manager name on Linux', () => {
			vi.stubGlobal('process', { ...process, platform: 'linux' });
			expect(getCommand('npm')).toBe('npm');
			vi.unstubAllGlobals();
		});
	});

	describe('stripControlSequences', () => {
		it('removes clear screen sequences', () => {
			const input = '\x1b[2JHello World';
			expect(stripControlSequences(input)).toBe('Hello World');
		});

		it('removes cursor home sequences', () => {
			const input = '\x1b[HHello';
			expect(stripControlSequences(input)).toBe('Hello');
		});

		it('removes cursor position sequences', () => {
			const input = '\x1b[10;20HHello\x1b[5;10fWorld';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes cursor movement sequences', () => {
			const input = '\x1b[5AHello\x1b[3BWorld\x1b[2CTest\x1b[4D';
			expect(stripControlSequences(input)).toBe('HelloWorldTest');
		});

		it('removes cursor save/restore sequences', () => {
			const input = '\x1b[sHello\x1b[uWorld';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes erase in line sequences', () => {
			const input = 'Hello\x1b[KWorld\x1b[2K';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes erase in display sequences', () => {
			const input = 'Hello\x1b[JWorld\x1b[2J';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes scroll sequences', () => {
			const input = 'Hello\x1b[5SWorld\x1b[3T';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes alternate screen buffer sequences', () => {
			const input = '\x1b[?1049hHello\x1b[?1049l\x1b[?47hWorld\x1b[?47l';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('removes cursor visibility sequences', () => {
			const input = '\x1b[?25hHello\x1b[?25l';
			expect(stripControlSequences(input)).toBe('Hello');
		});

		it('removes carriage returns', () => {
			const input = 'Hello\rWorld';
			expect(stripControlSequences(input)).toBe('HelloWorld');
		});

		it('handles multiple control sequences', () => {
			const input = '\x1b[2J\x1b[HHello\x1b[K\r\x1b[?25l World';
			expect(stripControlSequences(input)).toBe('Hello World');
		});

		it('preserves normal ANSI color codes', () => {
			const input = '\x1b[31mRed\x1b[0m';
			expect(stripControlSequences(input)).toBe('\x1b[31mRed\x1b[0m');
		});

		it('handles empty string', () => {
			expect(stripControlSequences('')).toBe('');
		});

		it('returns unchanged string without control sequences', () => {
			const input = 'Hello World';
			expect(stripControlSequences(input)).toBe('Hello World');
		});
	});
});
