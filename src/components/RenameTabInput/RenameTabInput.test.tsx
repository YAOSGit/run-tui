import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { RenameTabInput } from './index.js';

describe('RenameTabInput', () => {
	it('renders the initial name', () => {
		const { lastFrame } = render(
			<RenameTabInput
				initialName="build"
				onRename={vi.fn()}
				onClose={vi.fn()}
			/>,
		);

		expect(lastFrame()).toContain('build');
	});

	it('displays the rename label', () => {
		const { lastFrame } = render(
			<RenameTabInput
				initialName="build"
				onRename={vi.fn()}
				onClose={vi.fn()}
			/>,
		);

		expect(lastFrame()).toContain('rename:');
	});

	it('displays a cursor indicator', () => {
		const { lastFrame } = render(
			<RenameTabInput
				initialName="build"
				onRename={vi.fn()}
				onClose={vi.fn()}
			/>,
		);

		expect(lastFrame()).toContain('_');
	});

	it('displays footer commands', () => {
		const { lastFrame } = render(
			<RenameTabInput
				initialName="build"
				onRename={vi.fn()}
				onClose={vi.fn()}
			/>,
		);

		expect(lastFrame()).toContain('Enter');
		expect(lastFrame()).toContain('confirm');
		expect(lastFrame()).toContain('ESC');
		expect(lastFrame()).toContain('cancel');
	});

	it('calls onClose when escape is pressed', () => {
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput
				initialName="build"
				onRename={vi.fn()}
				onClose={onClose}
			/>,
		);

		stdin.write('\x1B');

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('calls onRename and onClose when enter is pressed', () => {
		const onRename = vi.fn();
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput
				initialName="build"
				onRename={onRename}
				onClose={onClose}
			/>,
		);

		stdin.write('\r');

		expect(onRename).toHaveBeenCalledWith('build');
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('does not call onRename on escape', () => {
		const onRename = vi.fn();
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput
				initialName="build"
				onRename={onRename}
				onClose={onClose}
			/>,
		);

		stdin.write('\x1B');

		expect(onRename).not.toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('submits initial name unchanged when enter is pressed immediately', () => {
		const onRename = vi.fn();
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput
				initialName="my-task"
				onRename={onRename}
				onClose={onClose}
			/>,
		);

		stdin.write('\r');

		expect(onRename).toHaveBeenCalledWith('my-task');
		expect(onClose).toHaveBeenCalledOnce();
	});

	it('submits trimmed value on enter', () => {
		const onRename = vi.fn();
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput
				initialName="build  "
				onRename={onRename}
				onClose={onClose}
			/>,
		);

		stdin.write('\r');

		expect(onRename).toHaveBeenCalledWith('build');
	});

	it('falls back to initial name when value is empty on submit', () => {
		const onRename = vi.fn();
		const onClose = vi.fn();
		const { stdin } = render(
			<RenameTabInput initialName="x" onRename={onRename} onClose={onClose} />,
		);

		// Delete the single character
		stdin.write('\x7F');
		// Submit
		stdin.write('\r');

		expect(onRename).toHaveBeenCalledWith('x');
	});
});
