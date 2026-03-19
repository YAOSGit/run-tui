import { describe, expectTypeOf, it } from 'vitest';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { TaskState } from '../../types/TaskState/index.js';
import type { UseProcessManagerOptions } from './useProcessManager.types.js';

describe('UseProcessManagerOptions', () => {
	it('has initialTasks as string array', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('initialTasks');
		expectTypeOf<UseProcessManagerOptions['initialTasks']>().toEqualTypeOf<string[]>();
	});

	it('has packageManager property', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('packageManager');
	});

	it('has restartConfig property', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('restartConfig');
	});

	it('has scriptArgs as string array', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('scriptArgs');
		expectTypeOf<UseProcessManagerOptions['scriptArgs']>().toEqualTypeOf<string[]>();
	});

	it('has onLogEntry callback accepting LogEntry', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('onLogEntry');
		expectTypeOf<UseProcessManagerOptions['onLogEntry']>().toBeFunction();
		expectTypeOf<UseProcessManagerOptions['onLogEntry']>().parameter(0).toEqualTypeOf<LogEntry>();
		expectTypeOf<UseProcessManagerOptions['onLogEntry']>().returns.toBeVoid();
	});

	it('has onTaskStateChange callback accepting taskName and partial TaskState', () => {
		expectTypeOf<UseProcessManagerOptions>().toHaveProperty('onTaskStateChange');
		expectTypeOf<UseProcessManagerOptions['onTaskStateChange']>().toBeFunction();
		expectTypeOf<UseProcessManagerOptions['onTaskStateChange']>().parameter(0).toEqualTypeOf<string>();
		expectTypeOf<UseProcessManagerOptions['onTaskStateChange']>().parameter(1).toEqualTypeOf<Partial<TaskState>>();
		expectTypeOf<UseProcessManagerOptions['onTaskStateChange']>().returns.toBeVoid();
	});
});
