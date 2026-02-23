import chalk from 'chalk';
import { describe, expect, it } from 'vitest';
import { hasAnsiCodes, highlightLog } from './index.js';

chalk.level = 1;

describe('syntaxHighlight', () => {
	describe('hasAnsiCodes', () => {
		it('detects standard ANSI codes', () => {
			expect(hasAnsiCodes('\x1b[31mRed\x1b[0m')).toBe(true);
			expect(hasAnsiCodes(chalk.green('Green'))).toBe(true);
		});

		it('returns false for plain text', () => {
			expect(hasAnsiCodes('Normal text without colors')).toBe(false);
			expect(hasAnsiCodes('Error: Something bad happened')).toBe(false);
		});
	});

	describe('highlightLog', () => {
		it('preserves existing ANSI strings formatting without touching them', () => {
			const original = `\x1b[32m"success"\x1b[0m and \x1b[31merror\x1b[0m`;
			const result = highlightLog(original);
			expect(result).toBe(original);
		});

		it('highlights strings in green', () => {
			const text = `Received "hello world" and 'foo bar'`;
			const expected = `Received ${chalk.green('"hello world"')} and ${chalk.green("'foo bar'")}`;
			expect(highlightLog(text)).toBe(expected);
		});

		it('highlights booleans and null in magenta', () => {
			const text = `is true or false or null value`;
			const expected = `is ${chalk.magenta('true')} or ${chalk.magenta('false')} or ${chalk.magenta('null')} value`;
			expect(highlightLog(text)).toBe(expected);
		});

		it('highlights integers and floats in yellow', () => {
			const text = `Status 404 in 1.5 -100`;
			const expected = `Status ${chalk.yellow('404')} in ${chalk.yellow('1.5')} ${chalk.yellow('-100')}`;
			expect(highlightLog(text)).toBe(expected);
		});

		it('highlights error keywords in red', () => {
			const text = `Fatal Exception: Error failed to load`;
			const expected = `${chalk.red('Fatal')} ${chalk.red('Exception')}: ${chalk.red('Error')} ${chalk.red('failed')} to load`;
			expect(highlightLog(text)).toBe(expected); // Note: case insensitive match keeps original case? Wait, the replacer takes the raw match!
		});

		it('highlights warning instances in yellow', () => {
			const text = `Warning: memory usage high`;
			const expected = `${chalk.yellow('Warning')}: memory usage high`;
			expect(highlightLog(text)).toBe(expected);
		});

		it('handles complex JSON-like objects', () => {
			const text = `{ "status": "error", "code": 500, "retry": false }`;
			// Evaluates to:
			// { chalk.green('"status"'): chalk.green('"error"'), chalk.green('"code"'): chalk.yellow('500'), chalk.green('"retry"'): chalk.magenta('false') }
			const expected = `{ ${chalk.green('"status"')}: ${chalk.green('"error"')}, ${chalk.green('"code"')}: ${chalk.yellow('500')}, ${chalk.green('"retry"')}: ${chalk.magenta('false')} }`;
			expect(highlightLog(text)).toBe(expected);
		});
	});
});
