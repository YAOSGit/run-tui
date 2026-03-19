import { describe, expectTypeOf, it } from 'vitest';
import type { LogEntry } from '../../types/LogEntry/index.js';
import type { LogType } from '../../types/LogType/index.js';
import type { LogsContextValue, LogsProviderProps } from './LogsProvider.types.js';

describe('LogsProviderProps', () => {
	it('has children property', () => {
		expectTypeOf<LogsProviderProps>().toHaveProperty('children');
	});
});

describe('LogsContextValue', () => {
	it('has addLog function accepting LogEntry', () => {
		expectTypeOf<LogsContextValue>().toHaveProperty('addLog');
		expectTypeOf<LogsContextValue['addLog']>().toBeFunction();
		expectTypeOf<LogsContextValue['addLog']>().parameter(0).toEqualTypeOf<LogEntry>();
		expectTypeOf<LogsContextValue['addLog']>().returns.toBeVoid();
	});

	it('has getLogsForTask returning LogEntry array', () => {
		expectTypeOf<LogsContextValue>().toHaveProperty('getLogsForTask');
		expectTypeOf<LogsContextValue['getLogsForTask']>().toBeFunction();
		expectTypeOf<LogsContextValue['getLogsForTask']>().returns.toEqualTypeOf<LogEntry[]>();
	});

	it('getLogsForTask accepts taskName, filter, optional limit and scrollOffset', () => {
		expectTypeOf<LogsContextValue['getLogsForTask']>().parameter(0).toEqualTypeOf<string>();
		expectTypeOf<LogsContextValue['getLogsForTask']>().parameter(1).toEqualTypeOf<LogType | null>();
	});

	it('has getLogCountForTask returning number', () => {
		expectTypeOf<LogsContextValue['getLogCountForTask']>().toBeFunction();
		expectTypeOf<LogsContextValue['getLogCountForTask']>().returns.toEqualTypeOf<number>();
	});

	it('has clearLogsForTask returning void', () => {
		expectTypeOf<LogsContextValue['clearLogsForTask']>().toBeFunction();
		expectTypeOf<LogsContextValue['clearLogsForTask']>().parameter(0).toEqualTypeOf<string>();
		expectTypeOf<LogsContextValue['clearLogsForTask']>().returns.toBeVoid();
	});
});
