import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';

vi.mock('../../providers/LogsProvider/index.js', () => ({
	useLogs: () => ({
		getLogsForTask: vi.fn().mockReturnValue([]),
	}),
}));

import { CompactView } from './index.js';

const createTaskState = (
	name: string,
	status: TaskState['status'],
	overrides: Partial<TaskState> = {},
): TaskState => ({
	name,
	status,
	exitCode:
		status === TASK_STATUS.SUCCESS
			? 0
			: status === TASK_STATUS.ERROR
				? 1
				: null,
	hasUnseenStderr: false,
	restartCount: 0,
	startedAt: null,
	endedAt: null,
	...overrides,
});

describe('CompactView', () => {
	it('renders task names', () => {
		const tasks = ['build', 'test', 'lint'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING),
			test: createTaskState('test', TASK_STATUS.PENDING),
			lint: createTaskState('lint', TASK_STATUS.SUCCESS),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('build');
		expect(lastFrame()).toContain('test');
		expect(lastFrame()).toContain('lint');
	});

	it('displays task status for each task', () => {
		const tasks = ['build', 'test'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING),
			test: createTaskState('test', TASK_STATUS.SUCCESS),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('running');
		expect(lastFrame()).toContain('success');
	});

	it('shows pending status for tasks without state', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('pending');
	});

	it('shows error status', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.ERROR),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('error');
	});

	it('highlights the active task with cursor indicator', () => {
		const tasks = ['build', 'test'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING),
			test: createTaskState('test', TASK_STATUS.RUNNING),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('>');
	});

	it('uses tab alias when provided', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{ build: 'my-build' }}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('my-build');
	});

	it('shows ellipsis when no logs available', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('...');
	});

	it('shows restarting status', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RESTARTING),
		};

		const { lastFrame } = render(
			<CompactView
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
				height={10}
			/>,
		);

		expect(lastFrame()).toContain('restarting');
	});
});
