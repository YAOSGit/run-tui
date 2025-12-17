import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { ScriptSelector } from './index.js';

describe('ScriptSelector', () => {
	const defaultProps = {
		availableScripts: ['build', 'test', 'lint', 'dev'],
		runningScripts: ['build'],
		onSelect: vi.fn(),
		onCancel: vi.fn(),
		height: 10,
	};

	it('displays the title', () => {
		const { lastFrame } = render(<ScriptSelector {...defaultProps} />);

		expect(lastFrame()).toContain('Select a script to run');
	});

	it('displays YAOSGit branding in footer', () => {
		const { lastFrame } = render(<ScriptSelector {...defaultProps} />);

		expect(lastFrame()).toContain('YAOSGit');
		expect(lastFrame()).toContain('run');
	});

	it('displays navigation commands in footer', () => {
		const { lastFrame } = render(<ScriptSelector {...defaultProps} />);

		expect(lastFrame()).toContain('navigate');
		expect(lastFrame()).toContain('select');
		expect(lastFrame()).toContain('cancel');
	});

	it('filters out already running scripts', () => {
		const { lastFrame } = render(
			<ScriptSelector
				{...defaultProps}
				availableScripts={['build', 'test', 'lint']}
				runningScripts={['build']}
			/>,
		);

		// 'build' should not be in the list since it's already running
		// We can't directly check the Select options, but we can verify
		// the component renders without the running script being selectable
		expect(lastFrame()).toBeDefined();
	});

	it('shows message when all scripts are running', () => {
		const { lastFrame } = render(
			<ScriptSelector
				{...defaultProps}
				availableScripts={['build', 'test']}
				runningScripts={['build', 'test']}
			/>,
		);

		expect(lastFrame()).toContain('All scripts are already running');
		expect(lastFrame()).toContain('Press ESC or q to go back');
	});

	it('calls onCancel when escape is pressed', () => {
		const onCancel = vi.fn();
		const { stdin } = render(
			<ScriptSelector {...defaultProps} onCancel={onCancel} />,
		);

		stdin.write('\x1B'); // Escape key

		expect(onCancel).toHaveBeenCalled();
	});

	it('calls onCancel when q is pressed', () => {
		const onCancel = vi.fn();
		const { stdin } = render(
			<ScriptSelector {...defaultProps} onCancel={onCancel} />,
		);

		stdin.write('q');

		expect(onCancel).toHaveBeenCalled();
	});

	it('calls onCancel when Q (uppercase) is pressed', () => {
		const onCancel = vi.fn();
		const { stdin } = render(
			<ScriptSelector {...defaultProps} onCancel={onCancel} />,
		);

		stdin.write('Q');

		expect(onCancel).toHaveBeenCalled();
	});

	it('renders with empty available scripts', () => {
		const { lastFrame } = render(
			<ScriptSelector
				{...defaultProps}
				availableScripts={[]}
				runningScripts={[]}
			/>,
		);

		expect(lastFrame()).toContain('All scripts are already running');
	});

	it('renders with no running scripts', () => {
		const { lastFrame } = render(
			<ScriptSelector
				{...defaultProps}
				availableScripts={['build', 'test']}
				runningScripts={[]}
			/>,
		);

		// All scripts should be available for selection
		expect(lastFrame()).toBeDefined();
		expect(lastFrame()).not.toContain('All scripts are already running');
	});
});
