import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { ConfirmDialog } from './index.js';

describe('ConfirmDialog', () => {
	it('displays the confirmation message', () => {
		const { lastFrame } = render(<ConfirmDialog message="Are you sure?" />);

		expect(lastFrame()).toContain('Are you sure?');
	});

	it('displays yes/no options', () => {
		const { lastFrame } = render(<ConfirmDialog message="Confirm?" />);

		expect(lastFrame()).toContain('y');
		expect(lastFrame()).toContain('yes');
		expect(lastFrame()).toContain('n');
		expect(lastFrame()).toContain('no');
	});

	it('displays YAOSGit branding', () => {
		const { lastFrame } = render(<ConfirmDialog message="Test" />);

		expect(lastFrame()).toContain('YAOSGit');
		expect(lastFrame()).toContain('run');
	});

	it('displays active task when provided', () => {
		const { lastFrame } = render(
			<ConfirmDialog
				message="Kill this task?"
				activeTask="build"
				status={TASK_STATUS.RUNNING}
			/>,
		);

		expect(lastFrame()).toContain('build');
		expect(lastFrame()).toContain('Kill this task?');
	});

	it('displays with running status', () => {
		const { lastFrame } = render(
			<ConfirmDialog
				message="Quit?"
				activeTask="test"
				status={TASK_STATUS.RUNNING}
			/>,
		);

		expect(lastFrame()).toContain('test');
		expect(lastFrame()).toContain('Quit?');
	});

	it('displays with success status', () => {
		const { lastFrame } = render(
			<ConfirmDialog
				message="Restart?"
				activeTask="lint"
				status={TASK_STATUS.SUCCESS}
			/>,
		);

		expect(lastFrame()).toContain('lint');
		expect(lastFrame()).toContain('Restart?');
	});

	it('displays with error status', () => {
		const { lastFrame } = render(
			<ConfirmDialog
				message="Retry?"
				activeTask="build"
				status={TASK_STATUS.ERROR}
			/>,
		);

		expect(lastFrame()).toContain('build');
		expect(lastFrame()).toContain('Retry?');
	});

	it('displays warning variant when no activeTask', () => {
		const { lastFrame } = render(<ConfirmDialog message="Quit application?" />);

		expect(lastFrame()).toContain('Quit application?');
	});

	it('handles pending status', () => {
		const { lastFrame } = render(
			<ConfirmDialog
				message="Start?"
				activeTask="dev"
				status={TASK_STATUS.PENDING}
			/>,
		);

		expect(lastFrame()).toContain('dev');
		expect(lastFrame()).toContain('Start?');
	});
});
