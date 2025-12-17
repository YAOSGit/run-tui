import type { Key } from 'ink';
import type { KeyBinding } from '../../types/KeyBinding/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import type { LogsContextValue } from '../LogsProvider/LogsProvider.types.js';
import type { TasksContextValue } from '../TasksProvider/TasksProvider.types.js';
import type { UIStateContextValue } from '../UIStateProvider/UIStateProvider.types.js';
import type { ViewContextValue } from '../ViewProvider/ViewProvider.types.js';

export interface CommandsProviderProps {
	children: React.ReactNode;
	keepAlive: boolean;
	onQuit: () => void;
}

export interface CommandProviders {
	tasks: TasksContextValue;
	logs: LogsContextValue;
	view: ViewContextValue;
	ui: UIStateContextValue;
	keepAlive: boolean;
	quit: () => void;
}

export interface Command {
	id: string;
	keys: KeyBinding[];
	displayKey?: string;
	displayText: string;
	isEnabled: (p: CommandProviders) => boolean;
	execute: (p: CommandProviders) => void;
	needsConfirmation?: (p: CommandProviders) => boolean;
	confirmMessage?: string | ((p: CommandProviders) => string);
}

export interface CommandsContextValue {
	handleInput: (input: string, key: Key) => void;
	getVisibleCommands: () => VisibleCommand[];
}
