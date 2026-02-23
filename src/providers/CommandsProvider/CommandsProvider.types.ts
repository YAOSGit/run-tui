import type { Key } from 'ink';
import type { KeyBinding } from '../../types/KeyBinding/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import type { LogsContextValue } from '../LogsProvider/LogsProvider.types.js';
import type { TasksContextValue } from '../TasksProvider/TasksProvider.types.js';
import type { UIStateContextValue } from '../UIStateProvider/UIStateProvider.types.js';
import type { ViewContextValue } from '../ViewProvider/ViewProvider.types.js';

export interface CommandsProviderProps {
	children: React.ReactNode;
	keepAlive?: boolean;
	onQuit?: () => void;
	onNextMatch?: () => void;
	onPrevMatch?: () => void;
}

export interface CommandProviders {
	tasks: TasksContextValue;
	logs: LogsContextValue;
	ui: UIStateContextValue;
	view: ViewContextValue;
	onNextMatch?: () => void;
	onPrevMatch?: () => void;
	keepAlive: boolean;
	quit: () => void;
}

export interface Command {
	id: string;
	keys: KeyBinding[];
	displayKey?: string;
	displayText: string;
	/** Controls whether/how this command appears in the footer bar.
	 *  'priority' — always shown first; 'optional' — shown if space permits; 'hidden' — never shown. */
	footer?: 'priority' | 'optional' | 'hidden';
	/** Ascending sort order within the footer (lower = shown first). */
	footerOrder?: number;
	/** Section heading in the Help Menu. Omit to hide from Help Menu entirely. */
	helpSection?: string;
	/** Label override for the Help Menu row. Falls back to displayText. */
	helpLabel?: string;
	isEnabled: (p: CommandProviders) => boolean;
	execute: (p: CommandProviders) => void;
	needsConfirmation?: (p: CommandProviders) => boolean;
	confirmMessage?: string | ((p: CommandProviders) => string);
}

export interface CommandsContextValue {
	handleInput: (input: string, key: Key) => void;
	getVisibleCommands: () => VisibleCommand[];
}
