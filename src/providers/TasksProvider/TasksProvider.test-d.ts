import { describe, expectTypeOf, it } from 'vitest';
import type { TasksContextValue, TasksProviderProps } from './TasksProvider.types.js';

describe('TasksProviderProps', () => {
	it('has children property', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('children');
	});

	it('has initialTasks as string array', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('initialTasks');
		expectTypeOf<TasksProviderProps['initialTasks']>().toEqualTypeOf<string[]>();
	});

	it('has packageManager property', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('packageManager');
	});

	it('has restartConfig property', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('restartConfig');
	});

	it('has scriptArgs as string array', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('scriptArgs');
		expectTypeOf<TasksProviderProps['scriptArgs']>().toEqualTypeOf<string[]>();
	});

	it('has onLogEntry callback', () => {
		expectTypeOf<TasksProviderProps>().toHaveProperty('onLogEntry');
		expectTypeOf<TasksProviderProps['onLogEntry']>().toBeFunction();
	});
});

describe('TasksContextValue', () => {
	it('has tasks as string array', () => {
		expectTypeOf<TasksContextValue>().toHaveProperty('tasks');
		expectTypeOf<TasksContextValue['tasks']>().toEqualTypeOf<string[]>();
	});

	it('has pinnedTasks as string array', () => {
		expectTypeOf<TasksContextValue>().toHaveProperty('pinnedTasks');
		expectTypeOf<TasksContextValue['pinnedTasks']>().toEqualTypeOf<string[]>();
	});

	it('has tabAliases as Record<string, string>', () => {
		expectTypeOf<TasksContextValue>().toHaveProperty('tabAliases');
		expectTypeOf<TasksContextValue['tabAliases']>().toEqualTypeOf<Record<string, string>>();
	});

	it('has taskStates as Record', () => {
		expectTypeOf<TasksContextValue>().toHaveProperty('taskStates');
	});

	it('has hasRunningTasks boolean', () => {
		expectTypeOf<TasksContextValue>().toHaveProperty('hasRunningTasks');
		expectTypeOf<TasksContextValue['hasRunningTasks']>().toEqualTypeOf<boolean>();
	});

	it('has action methods returning void', () => {
		expectTypeOf<TasksContextValue['addTask']>().toBeFunction();
		expectTypeOf<TasksContextValue['addTask']>().returns.toBeVoid();
		expectTypeOf<TasksContextValue['closeTask']>().toBeFunction();
		expectTypeOf<TasksContextValue['restartTask']>().toBeFunction();
		expectTypeOf<TasksContextValue['killTask']>().toBeFunction();
		expectTypeOf<TasksContextValue['killAllTasks']>().toBeFunction();
		expectTypeOf<TasksContextValue['cancelRestart']>().toBeFunction();
		expectTypeOf<TasksContextValue['markStderrSeen']>().toBeFunction();
		expectTypeOf<TasksContextValue['toggleTaskPin']>().toBeFunction();
		expectTypeOf<TasksContextValue['renameTask']>().toBeFunction();
		expectTypeOf<TasksContextValue['moveTaskLeft']>().toBeFunction();
		expectTypeOf<TasksContextValue['moveTaskRight']>().toBeFunction();
	});

	it('getTaskStatus returns TaskStatus or undefined', () => {
		expectTypeOf<TasksContextValue['getTaskStatus']>().toBeFunction();
	});
});
