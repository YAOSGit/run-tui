import { EventEmitter } from 'node:events';
import path from 'node:path';
import * as pty from 'node-pty';
import stripAnsi from 'strip-ansi';

export interface PTYRunnerOptions {
	cwd?: string;
	env?: Record<string, string>;
	cols?: number;
	rows?: number;
}

export interface WaitForOptions {
	timeout?: number;
	stripAnsi?: boolean;
}

export class PTYRunner extends EventEmitter {
	private pty: pty.IPty | null = null;
	private output = '';
	private exitCode: number | null = null;
	private exitPromise: Promise<number> | null = null;

	constructor(private options: PTYRunnerOptions = {}) {
		super();
	}

	async start(args: string[] = []): Promise<void> {
		const cliPath = path.resolve(import.meta.dirname, '../../dist/cli.js');

		this.pty = pty.spawn('node', [cliPath, ...args], {
			name: 'xterm-256color',
			cols: this.options.cols ?? 80,
			rows: this.options.rows ?? 24,
			cwd: this.options.cwd ?? process.cwd(),
			env: {
				...process.env,
				...this.options.env,
				FORCE_COLOR: '1',
				TERM: 'xterm-256color',
			},
		});

		this.exitPromise = new Promise((resolve) => {
			this.pty?.onExit(({ exitCode }) => {
				this.exitCode = exitCode;
				resolve(exitCode);
			});
		});

		this.pty.onData((data) => {
			this.output += data;
			this.emit('data', data);
		});
	}

	write(input: string): void {
		if (!this.pty) throw new Error('PTY not started');
		this.pty.write(input);
	}

	sendKey(
		key:
			| 'enter'
			| 'escape'
			| 'tab'
			| 'up'
			| 'down'
			| 'left'
			| 'right'
			| 'ctrl+c',
	): void {
		const keyMap: Record<string, string> = {
			enter: '\r',
			escape: '\x1b',
			tab: '\t',
			up: '\x1b[A',
			down: '\x1b[B',
			right: '\x1b[C',
			left: '\x1b[D',
			'ctrl+c': '\x03',
		};
		this.write(keyMap[key] ?? key);
	}

	getOutput(strip = true): string {
		return strip ? stripAnsi(this.output) : this.output;
	}

	clearOutput(): void {
		this.output = '';
	}

	async waitForText(
		text: string,
		options: WaitForOptions = {},
	): Promise<boolean> {
		const { timeout = 5000, stripAnsi: strip = true } = options;
		const startTime = Date.now();

		return new Promise((resolve, reject) => {
			const check = () => {
				const output = strip ? stripAnsi(this.output) : this.output;
				if (output.includes(text)) {
					resolve(true);
					return;
				}
				if (Date.now() - startTime > timeout) {
					reject(
						new Error(
							`Timeout waiting for text: "${text}"\nCurrent output:\n${output}`,
						),
					);
					return;
				}
				setTimeout(check, 50);
			};
			check();
		});
	}

	async waitForPattern(
		pattern: RegExp,
		options: WaitForOptions = {},
	): Promise<RegExpMatchArray | null> {
		const { timeout = 5000, stripAnsi: strip = true } = options;
		const startTime = Date.now();

		return new Promise((resolve, reject) => {
			const check = () => {
				const output = strip ? stripAnsi(this.output) : this.output;
				const match = output.match(pattern);
				if (match) {
					resolve(match);
					return;
				}
				if (Date.now() - startTime > timeout) {
					reject(
						new Error(
							`Timeout waiting for pattern: ${pattern}\nCurrent output:\n${output}`,
						),
					);
					return;
				}
				setTimeout(check, 50);
			};
			check();
		});
	}

	async waitForExit(timeout = 10000): Promise<number> {
		if (this.exitCode !== null) return this.exitCode;
		if (!this.exitPromise) throw new Error('PTY not started');

		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error('Timeout waiting for exit')), timeout);
		});

		return Promise.race([this.exitPromise, timeoutPromise]);
	}

	kill(signal: NodeJS.Signals = 'SIGTERM'): void {
		if (this.pty) {
			this.pty.kill(signal);
		}
	}

	async cleanup(): Promise<void> {
		if (this.pty) {
			this.kill();
			await this.waitForExit().catch(() => { });
			this.pty = null;
		}
		this.output = '';
		this.exitCode = null;
		this.exitPromise = null;
	}
}
