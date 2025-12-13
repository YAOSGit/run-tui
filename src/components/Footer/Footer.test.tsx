import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { LOG_TYPE } from '../../types/LogType/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { Footer } from './index.js';

const defaultCommands: VisibleCommand[] = [
	{ displayKey: '←/→', displayText: 'switch' },
	{ displayKey: 'n', displayText: 'new' },
	{ displayKey: 'f', displayText: 'filter' },
	{ displayKey: 'k', displayText: 'kill' },
	{ displayKey: 'q', displayText: 'quit' },
];

describe('Footer', () => {
	it('displays the active task name', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.RUNNING}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('build');
	});

	it('displays the task status', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="test"
				status={TASK_STATUS.SUCCESS}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('success');
	});

	it('displays pending status', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="lint"
				status={TASK_STATUS.PENDING}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('pending');
	});

	it('displays error status', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.ERROR}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('error');
	});

	it('displays "all" when log filter is null', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.RUNNING}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('[all]');
	});

	it('displays stdout filter', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.RUNNING}
				logFilter={LOG_TYPE.STDOUT}
			/>,
		);

		expect(lastFrame()).toContain('[stdout]');
	});

	it('displays stderr filter', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.RUNNING}
				logFilter={LOG_TYPE.STDERR}
			/>,
		);

		expect(lastFrame()).toContain('[stderr]');
	});

	it('displays keyboard shortcuts from commands', () => {
		const { lastFrame } = render(
			<Footer
				commands={defaultCommands}
				activeTask="build"
				status={TASK_STATUS.RUNNING}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('YAOSGit');
		expect(lastFrame()).toContain('run');
		expect(lastFrame()).toContain('←/→');
		expect(lastFrame()).toContain('switch');
		expect(lastFrame()).toContain('f');
		expect(lastFrame()).toContain('filter');
		expect(lastFrame()).toContain('k');
		expect(lastFrame()).toContain('kill');
		expect(lastFrame()).toContain('q');
		expect(lastFrame()).toContain('quit');
	});

	it('does not show status bar when no activeTask', () => {
		const { lastFrame } = render(
			<Footer
				commands={[
					{ displayKey: 'n', displayText: 'new' },
					{ displayKey: 'q', displayText: 'quit' },
				]}
				activeTask={undefined}
				status={undefined}
				logFilter={null}
			/>,
		);

		expect(lastFrame()).toContain('YAOSGit');
		expect(lastFrame()).toContain('run');
		expect(lastFrame()).not.toContain('running');
	});
});
