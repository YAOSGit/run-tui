import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { LogType } from '../LogType/index.js';
import type { TaskStatus } from '../TaskStatus/index.js';
import type { CommandContext } from './index.js';

describe('CommandContext type tests', () => {
	it('CommandContext has correct state property types', () => {
		expectTypeOf<CommandContext['activeTask']>().toEqualTypeOf<
			string | undefined
		>();
		expectTypeOf<CommandContext['taskStatus']>().toEqualTypeOf<
			TaskStatus | undefined
		>();
		expectTypeOf<CommandContext['runningTasks']>().toEqualTypeOf<string[]>();
		expectTypeOf<CommandContext['hasRunningTasks']>().toEqualTypeOf<boolean>();
		expectTypeOf<CommandContext['keepAlive']>().toEqualTypeOf<boolean>();
		expectTypeOf<CommandContext['showScriptSelector']>().toEqualTypeOf<boolean>();
		expectTypeOf<CommandContext['logFilter']>().toEqualTypeOf<LogType | null>();
	});

	it('killProcess is a function taking string', () => {
		expectTypeOf<CommandContext['killProcess']>().toBeFunction();
		expectTypeOf<CommandContext['killProcess']>().parameters.toEqualTypeOf<
			[string]
		>();
		expectTypeOf<CommandContext['killProcess']>().returns.toEqualTypeOf<void>();
	});

	it('spawnTask is a function taking string', () => {
		expectTypeOf<CommandContext['spawnTask']>().toBeFunction();
		expectTypeOf<CommandContext['spawnTask']>().parameters.toEqualTypeOf<
			[string]
		>();
		expectTypeOf<CommandContext['spawnTask']>().returns.toEqualTypeOf<void>();
	});

	it('handleQuit is a function with no parameters', () => {
		expectTypeOf<CommandContext['handleQuit']>().toBeFunction();
		expectTypeOf<CommandContext['handleQuit']>().parameters.toEqualTypeOf<[]>();
		expectTypeOf<CommandContext['handleQuit']>().returns.toEqualTypeOf<void>();
	});

	it('setShowScriptSelector is a function taking boolean', () => {
		expectTypeOf<CommandContext['setShowScriptSelector']>().toBeFunction();
		expectTypeOf<
			CommandContext['setShowScriptSelector']
		>().parameters.toEqualTypeOf<[boolean]>();
	});

	it('removeTask is a function taking string', () => {
		expectTypeOf<CommandContext['removeTask']>().toBeFunction();
		expectTypeOf<CommandContext['removeTask']>().parameters.toEqualTypeOf<
			[string]
		>();
	});

	it('markStderrSeen is a function taking string', () => {
		expectTypeOf<CommandContext['markStderrSeen']>().toBeFunction();
		expectTypeOf<CommandContext['markStderrSeen']>().parameters.toEqualTypeOf<
			[string]
		>();
	});

	it('setLogFilter is a React dispatch function', () => {
		expectTypeOf<CommandContext['setLogFilter']>().toBeFunction();
	});

	it('setRunningTasks is a React dispatch function', () => {
		expectTypeOf<CommandContext['setRunningTasks']>().toBeFunction();
	});

	it('setActiveTabIndex is a React dispatch function', () => {
		expectTypeOf<CommandContext['setActiveTabIndex']>().toBeFunction();
	});
});
