import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { TaskTime } from './index.js';

describe('TaskTime', () => {
	it('renders nothing when startedAt is null', () => {
		const { lastFrame } = render(<TaskTime startedAt={null} endedAt={null} />);

		expect(lastFrame()).toBe('');
	});

	it('displays elapsed time for completed task', () => {
		const startedAt = 1000;
		const endedAt = 6000; // 5 seconds later

		const { lastFrame } = render(
			<TaskTime startedAt={startedAt} endedAt={endedAt} />,
		);

		expect(lastFrame()).toContain('5s');
	});

	it('displays minutes and seconds for longer durations', () => {
		const startedAt = 0;
		const endedAt = 125000; // 2m 5s

		const { lastFrame } = render(
			<TaskTime startedAt={startedAt} endedAt={endedAt} />,
		);

		expect(lastFrame()).toContain('2m');
		expect(lastFrame()).toContain('5s');
	});

	it('displays hours for very long durations', () => {
		const startedAt = 0;
		const endedAt = 3661000; // 1h 1m 1s

		const { lastFrame } = render(
			<TaskTime startedAt={startedAt} endedAt={endedAt} />,
		);

		expect(lastFrame()).toContain('1h');
		expect(lastFrame()).toContain('1m');
		expect(lastFrame()).toContain('1s');
	});

	it('displays time in parentheses', () => {
		const startedAt = 0;
		const endedAt = 3000; // 3 seconds

		const { lastFrame } = render(
			<TaskTime startedAt={startedAt} endedAt={endedAt} />,
		);

		expect(lastFrame()).toContain('(');
		expect(lastFrame()).toContain(')');
	});

	it('displays running time using current time when endedAt is null', () => {
		const now = Date.now();
		vi.spyOn(Date, 'now').mockReturnValue(now);

		const startedAt = now - 10000; // 10 seconds ago

		const { lastFrame } = render(
			<TaskTime startedAt={startedAt} endedAt={null} />,
		);

		expect(lastFrame()).toContain('10s');

		vi.restoreAllMocks();
	});

	it('displays 0s for tasks that just started', () => {
		const now = Date.now();
		vi.spyOn(Date, 'now').mockReturnValue(now);

		const { lastFrame } = render(<TaskTime startedAt={now} endedAt={now} />);

		expect(lastFrame()).toContain('0s');

		vi.restoreAllMocks();
	});
});
