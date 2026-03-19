import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import type { TaskState } from '../../types/TaskState/index.js';
import { TASK_STATUS } from '../../types/TaskStatus/index.js';
import { TabBar } from './index.js';

describe('TabBar', () => {
	const createTaskState = (
		name: string,
		status: TaskState['status'],
		hasUnseenStderr = false,
	): TaskState => ({
		name,
		status,
		exitCode:
			status === TASK_STATUS.SUCCESS
				? 0
				: status === TASK_STATUS.ERROR
					? 1
					: null,
		hasUnseenStderr,
		restartCount: 0,
		startedAt: null,
		endedAt: null,
	});

	it('renders task names', () => {
		const tasks = ['build', 'test', 'lint'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.PENDING),
			test: createTaskState('test', TASK_STATUS.PENDING),
			lint: createTaskState('lint', TASK_STATUS.PENDING),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		const frame = lastFrame() ?? '';
		expect(frame).toContain('build');
		expect(frame).toContain('test');
		expect(frame).toContain('lint');
	});

	it('shows idle icon for pending status', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.PENDING),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		expect(lastFrame() ?? '').toContain('○');
	});

	it('shows success icon for completed tasks', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.SUCCESS),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		expect(lastFrame() ?? '').toContain('✓');
	});

	it('shows error icon for failed tasks', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.ERROR),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		expect(lastFrame() ?? '').toContain('✗');
	});

	it('shows ERR flag when task has unseen stderr', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING, true),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		expect(lastFrame() ?? '').toContain('ERR');
	});

	it('does not show ERR flag when no unseen stderr', () => {
		const tasks = ['build'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.RUNNING, false),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
			/>,
		);

		expect(lastFrame() ?? '').not.toContain('ERR');
	});

	it('highlights the active tab', () => {
		const tasks = ['build', 'test'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.PENDING),
			test: createTaskState('test', TASK_STATUS.PENDING),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={1}
			/>,
		);

		const frame = lastFrame() ?? '';
		expect(frame).toContain('build');
		expect(frame).toContain('test');
	});

	it('renders multiple tasks with different status icons', () => {
		const tasks = ['build', 'test', 'lint'];
		const taskStates: Record<string, TaskState> = {
			build: createTaskState('build', TASK_STATUS.SUCCESS),
			test: createTaskState('test', TASK_STATUS.RUNNING),
			lint: createTaskState('lint', TASK_STATUS.ERROR),
		};

		const { lastFrame } = render(
			<TabBar
				tasks={tasks}
				taskStates={taskStates}
				pinnedTasks={[]}
				tabAliases={{}}
				activeTabIndex={0}
				width={120}
			/>,
		);

		const frame = lastFrame() ?? '';
		expect(frame).toContain('✓');
		expect(frame).toContain('✗');
	});
});
