import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useLogs as useLogsHook } from '../../hooks/useLogs/index.js';
import type {
	LogsContextValue,
	LogsProviderProps,
} from './LogsProvider.types.js';

const LogsContext = createContext<LogsContextValue | null>(null);

export const LogsProvider: React.FC<LogsProviderProps> = ({ children }) => {
	const { addLog, getLogsForTask, getLogCountForTask, clearLogsForTask } =
		useLogsHook();

	const value: LogsContextValue = useMemo(
		() => ({
			addLog,
			getLogsForTask,
			getLogCountForTask,
			clearLogsForTask,
		}),
		[addLog, getLogsForTask, getLogCountForTask, clearLogsForTask],
	);

	return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
};

export const useLogs = (): LogsContextValue => {
	const context = useContext(LogsContext);
	if (!context) {
		throw new Error('useLogs must be used within a LogsProvider');
	}
	return context;
};
