import type { Key } from 'ink';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import type { LogsContextValue } from '../LogsProvider/LogsProvider.types.js';
import type { TasksContextValue } from '../TasksProvider/TasksProvider.types.js';
import type { UIStateContextValue } from '../UIStateProvider/UIStateProvider.types.js';
import type { ViewContextValue } from '../ViewProvider/ViewProvider.types.js';

export type CommandsProviderProps = {
	children: React.ReactNode;
	keepAlive?: boolean;
	onQuit?: () => void;
};

export type CommandProviders = {
	tasks: TasksContextValue;
	logs: LogsContextValue;
	ui: UIStateContextValue;
	view: ViewContextValue;
	keepAlive: boolean;
	quit: () => void;
};

export type CommandsContextValue = {
	handleInput: (input: string, key: Key) => void;
	getVisibleCommands: () => VisibleCommand[];
};
