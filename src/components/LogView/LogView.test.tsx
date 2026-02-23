import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { LogView } from './index.js';

describe('LogView', () => {
	const createLog = (
		id: string,
		text: string,
		type: 'stdout' | 'stderr' = 'stdout',
	) => ({
		id,
		task: 'test',
		text,
		type,
		timestamp: '12:00:00',
	});

	it('shows waiting message when logs are empty and not running', () => {
		const { lastFrame } = render(<LogView logs={[]} isRunning={false} />);
		expect(lastFrame()).toContain('Waiting for output...');
	});

	it('shows waiting message with spinner when running', () => {
		const { lastFrame } = render(<LogView logs={[]} isRunning={true} />);
		expect(lastFrame()).toContain('Waiting for output...');
	});

	it('renders log entries', () => {
		const logs = [createLog('1', 'First log'), createLog('2', 'Second log')];
		const { lastFrame } = render(<LogView logs={logs} showTimestamps={true} />);

		expect(lastFrame()).toContain('First log');
		expect(lastFrame()).toContain('Second log');
		expect(lastFrame()).toContain('[12:00:00]');
	});

	it('renders stdout logs without special color', () => {
		const logs = [createLog('1', 'stdout message', LOG_TYPE.STDOUT)];
		const { lastFrame } = render(<LogView logs={logs} />);

		expect(lastFrame()).toContain('stdout message');
	});

	it('renders stderr logs', () => {
		const logs = [createLog('1', 'error message', LOG_TYPE.STDERR)];
		const { lastFrame } = render(<LogView logs={logs} />);

		expect(lastFrame()).toContain('error message');
	});

	it('renders mixed log types', () => {
		const logs = [
			createLog('1', 'normal output', LOG_TYPE.STDOUT),
			createLog('2', 'error output', LOG_TYPE.STDERR),
			createLog('3', 'more output', LOG_TYPE.STDOUT),
		];
		const { lastFrame } = render(<LogView logs={logs} />);

		expect(lastFrame()).toContain('normal output');
		expect(lastFrame()).toContain('error output');
		expect(lastFrame()).toContain('more output');
	});

	it('respects custom height prop', () => {
		const logs = [createLog('1', 'test')];
		const { lastFrame } = render(<LogView logs={logs} height={10} />);

		expect(lastFrame()).toContain('test');
	});

	describe('lineOverflow prop', () => {
		it('renders with wrap mode without errors', () => {
			const logs = [createLog('1', 'a'.repeat(200))];
			const { lastFrame } = render(
				<LogView logs={logs} lineOverflow={LINE_OVERFLOW.WRAP} />,
			);
			expect(lastFrame()).toContain('aaa');
		});

		it('renders with truncate mode without errors', () => {
			const logs = [createLog('1', 'a'.repeat(200))];
			const { lastFrame } = render(
				<LogView logs={logs} lineOverflow={LINE_OVERFLOW.TRUNCATE} />,
			);
			expect(lastFrame()).toContain('aaa');
		});

		it('renders with truncate-end mode without errors', () => {
			const logs = [createLog('1', 'a'.repeat(200))];
			const { lastFrame } = render(
				<LogView logs={logs} lineOverflow={LINE_OVERFLOW.TRUNCATE_END} />,
			);
			expect(lastFrame()).toContain('aaa');
		});
	});
});
