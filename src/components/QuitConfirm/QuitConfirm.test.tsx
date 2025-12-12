import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { QuitConfirm } from './index.js';

describe('QuitConfirm', () => {
	it('displays the running task count (singular)', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={1} />);

		expect(lastFrame()).toContain('1 task still running');
	});

	it('displays the running task count (plural)', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={3} />);

		expect(lastFrame()).toContain('3 tasks still running');
	});

	it('displays the confirmation message', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={2} />);

		expect(lastFrame()).toContain('Quit and kill all processes?');
	});

	it('displays yes/no options', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={1} />);

		expect(lastFrame()).toContain('y');
		expect(lastFrame()).toContain('yes');
		expect(lastFrame()).toContain('n');
		expect(lastFrame()).toContain('no');
	});

	it('displays RUN-TUI branding', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={1} />);

		expect(lastFrame()).toContain('RUN-TUI');
	});

	it('handles zero running tasks', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={0} />);

		// 0 is treated as singular in the component logic
		expect(lastFrame()).toContain('0 task still running');
	});

	it('handles large number of running tasks', () => {
		const { lastFrame } = render(<QuitConfirm runningCount={100} />);

		expect(lastFrame()).toContain('100 tasks still running');
	});
});
