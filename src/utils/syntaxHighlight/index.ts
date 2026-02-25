import chalk from 'chalk';

// Quick check if a string contains ANSI escape codes
const ANSI_REGEX =
	// biome-ignore lint/suspicious/noControlCharactersInRegex: checking ansi escapes natively requires control chars
	/[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/;

export const hasAnsiCodes = (text: string): boolean => {
	return ANSI_REGEX.test(text);
};

export const highlightLog = (text: string): string => {
	// If the log already has colors from the inner process, preserve its custom styling
	if (hasAnsiCodes(text)) {
		return text;
	}

	const result = text;

	// Note on replace ordering:
	// We want to replace strings first, but doing it naively via straight regexes into chalk
	// can sometimes conflict if one matches ANSI bytes injected by a previous replace.
	// chalk adds \x1b[...m. We need to be careful that subsequent regexes don't match
	// the inserted ANSI characters.

	// A safe way is to tokenize or just use very specific regexes that don't overlap,
	// or perform a single pass multiplexer. For simplicity, we'll use a replacer function multiplexer.

	// Tokens:
	// 1. Quoted Strings: "..." or '...'
	// 2. Booleans/Null: true, false, null
	// 3. Numbers: 123, -123, 1.23, .5
	// 4. Error Keywords: error, failed, fatal, exception, warning

	const tokenizerRegex =
		/("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b(?:true|false|null)\b)|(\b(?:error|fail|failed|fatal|exception)\b)|(\bwarning\b)|((?<![\w.-])-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\w.-]))/gi;

	return result.replace(
		tokenizerRegex,
		(match, str, boolNull, err, warn, num) => {
			if (str) {
				return chalk.green(str);
			}
			if (boolNull) {
				return chalk.magenta(boolNull);
			}
			if (err) {
				return chalk.red(err);
			}
			if (warn) {
				return chalk.yellow(warn);
			}
			if (num) {
				// Avoid highlighting strings of text that just happen to look like a number if they are part of a larger alphanumeric,
				// but the \b boundaries in the regex already handle most of that.
				return chalk.yellow(num);
			}
			return match;
		},
	);
};
