import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../providers/UIStateProvider/index.js', () => ({
	useUIState: () => ({
		closeHelp: vi.fn(),
	}),
}));

import { HelpMenu } from './index.js';

describe('HelpMenu', () => {
	it('renders the help menu title', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('Keyboard Shortcuts');
	});

	it('renders the General section', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('General');
	});

	it('renders the View & Modes section', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('View & Modes');
	});

	it('renders the Logs section', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('Logs (Ctrl)');
	});

	it('renders the Mass Actions section', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('Mass Actions (Shift)');
	});

	it('displays close instructions', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('ESC');
		expect(lastFrame()).toContain('to close');
	});

	it('renders keyboard shortcut keys', () => {
		const { lastFrame } = render(<HelpMenu />);

		expect(lastFrame()).toContain('q');
		expect(lastFrame()).toContain('Quit');
	});

	it('accepts optional width prop', () => {
		const { lastFrame } = render(<HelpMenu width={80} />);

		expect(lastFrame()).toContain('Keyboard Shortcuts');
	});
});
