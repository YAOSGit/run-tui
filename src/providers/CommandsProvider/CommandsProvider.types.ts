import type { Key } from 'ink';
import type {
	BaseDeps,
	Command,
	OverlayState,
} from '@yaos-git/toolkit/types';
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

/**
 * Combined UI surface exposed to commands.
 * Includes the full UIStateContextValue (showScriptSelector, openHelp, etc.)
 * plus OverlayState (activeOverlay, setActiveOverlay, confirmation,
 * requestConfirmation, clearConfirmation) and cycleFocus — which together
 * satisfy BaseDeps['ui'].
 */
export type RunTuiUI = UIStateContextValue &
	OverlayState & { cycleFocus: () => void };

/**
 * run-tui's dependency bag for the toolkit's command system.
 * Extends BaseDeps (ui: OverlayState & { cycleFocus }, onQuit) with
 * project-specific context values.
 */
export type RunTuiDeps = BaseDeps & {
	ui: RunTuiUI;
	tasks: TasksContextValue;
	logs: LogsContextValue;
	view: ViewContextValue;
	keepAlive: boolean;
};

/**
 * run-tui command: toolkit Command extended with confirmation support.
 */
export type RunTuiCommand = Command<RunTuiDeps> & {
	needsConfirmation?: (deps: RunTuiDeps) => boolean;
	confirmMessage?: string | ((deps: RunTuiDeps) => string);
};

/**
 * Legacy alias — kept so existing command tests that create mock providers
 * keep compiling unchanged. The shape is structurally compatible with
 * RunTuiDeps when the adapter is applied in the CommandsProvider.
 */
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
	deps: RunTuiDeps;
};
