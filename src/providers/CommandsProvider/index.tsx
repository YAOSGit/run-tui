import type { Key } from 'ink';
import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { createCommandsProvider } from '@yaos-git/toolkit/tui/commands';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { useLogs } from '../LogsProvider/index.js';
import { useTasks } from '../TasksProvider/index.js';
import { useUIState } from '../UIStateProvider/index.js';
import { useView } from '../ViewProvider/index.js';
import {
	CONFIRM_NO_KEYS,
	CONFIRM_YES_KEYS,
	PROJECT_COMMANDS,
} from './CommandsProvider.consts.js';
import type {
	CommandsContextValue,
	CommandsProviderProps,
	RunTuiCommand,
	RunTuiDeps,
	RunTuiUI,
} from './CommandsProvider.types.js';
import { getDisplayKey, isKeyMatch } from './CommandsProvider.utils.js';

/**
 * Use createCommandsProvider to merge project commands with toolkit
 * shared commands (help, quit, scroll, cycleFocus).
 */
const { COMMANDS: TOOLKIT_COMMANDS } = createCommandsProvider<RunTuiDeps>(
	PROJECT_COMMANDS,
);

/**
 * Full merged COMMANDS array including toolkit shared commands.
 * Exported so that the HelpMenu and other consumers can reference it.
 */
export const COMMANDS = TOOLKIT_COMMANDS as RunTuiCommand[];

const CommandsContext = createContext<CommandsContextValue | null>(null);

export const CommandsProvider: React.FC<CommandsProviderProps> = ({
	children,
	keepAlive,
	onQuit,
}) => {
	const tasks = useTasks();
	const logs = useLogs();
	const view = useView();
	const uiState = useUIState();

	// Track the command that requested confirmation (for matching repeat key)
	const pendingCommandRef = useRef<RunTuiCommand | null>(null);

	/**
	 * Build the RunTuiDeps object that commands receive.
	 * The `ui` field is an adapter that bridges UIStateContextValue
	 * booleans to the toolkit's OverlayState interface.
	 */
	const deps: RunTuiDeps = useMemo(() => {
		const ui: RunTuiUI = {
			// --- UIStateContextValue fields ---
			showScriptSelector: uiState.showScriptSelector,
			showHelp: uiState.showHelp,
			pendingConfirmation: uiState.pendingConfirmation,
			lineOverflow: uiState.lineOverflow,
			openScriptSelector: uiState.openScriptSelector,
			closeScriptSelector: uiState.closeScriptSelector,
			requestConfirmation: uiState.requestConfirmation,
			confirmPending: uiState.confirmPending,
			cancelPending: uiState.cancelPending,
			cycleLineOverflow: uiState.cycleLineOverflow,
			openHelp: uiState.openHelp,
			closeHelp: uiState.closeHelp,
			toggleHelp: uiState.toggleHelp,

			// --- OverlayState adapter ---
			activeOverlay: uiState.showHelp
				? 'help'
				: uiState.showScriptSelector
					? 'selector'
					: view.showSearch
						? 'search'
						: view.showRenameInput
							? 'rename'
							: uiState.pendingConfirmation
								? 'confirmation'
								: 'none',
			setActiveOverlay: (overlay: string | 'none') => {
				// Map toolkit overlay names back to UIState boolean setters
				switch (overlay) {
					case 'help':
						uiState.openHelp();
						break;
					case 'selector':
						uiState.openScriptSelector();
						break;
					case 'search':
						view.openSearch();
						break;
					case 'rename':
						view.openRenameInput();
						break;
					case 'none':
						uiState.closeHelp();
						uiState.closeScriptSelector();
						view.closeSearch();
						view.closeRenameInput();
						break;
				}
			},
			confirmation: uiState.pendingConfirmation,
			clearConfirmation: () => {
				uiState.cancelPending();
			},

			// --- cycleFocus (BaseDeps requirement) ---
			cycleFocus: view.cyclePaneFocus,
		};

		return {
			ui,
			tasks,
			logs,
			view,
			keepAlive: keepAlive ?? false,
			onQuit: onQuit ?? (() => {}),
		};
	}, [tasks, logs, view, uiState, keepAlive, onQuit]);

	const handleInput = useCallback(
		(input: string, key: Key) => {
			if (view.showSearch) {
				return;
			}

			// Handle confirmation mode
			if (uiState.pendingConfirmation) {
				// Confirm with y, Enter, or the same key that triggered the confirmation
				if (
					isKeyMatch(key, input, CONFIRM_YES_KEYS) ||
					(pendingCommandRef.current &&
						isKeyMatch(key, input, pendingCommandRef.current.keys))
				) {
					uiState.confirmPending();
					pendingCommandRef.current = null;
					return;
				}
				if (isKeyMatch(key, input, CONFIRM_NO_KEYS)) {
					uiState.cancelPending();
					pendingCommandRef.current = null;
					return;
				}
				// Ignore other keys during confirmation
				return;
			}

			// Ignore global commands if typing in an input overlay
			if (
				deps.ui.showHelp ||
				deps.view.showSearch ||
				deps.view.showRenameInput
			) {
				return;
			}

			// Find and execute matching command
			for (const command of COMMANDS) {
				if (
					isKeyMatch(key, input, command.keys) &&
					command.isEnabled(deps)
				) {
					// Check if command needs confirmation
					if (command.needsConfirmation?.(deps)) {
						const message =
							typeof command.confirmMessage === 'function'
								? command.confirmMessage(deps)
								: (command.confirmMessage ?? 'Are you sure?');
						pendingCommandRef.current = command;
						uiState.requestConfirmation(message, () =>
							command.execute(deps),
						);
						return;
					}

					// Execute directly
					command.execute(deps);
					return;
				}
			}
		},
		[deps, uiState, deps.ui.showHelp, view.showSearch],
	);

	const getVisibleCommands = useCallback((): VisibleCommand[] => {
		const seenIds = new Set<string>();
		const seen = new Set<string>();
		const priority: VisibleCommand[] = [];
		const optional: VisibleCommand[] = [];

		for (const command of COMMANDS) {
			if (command.footer === 'hidden') continue;

			// Deduplicate by command id (project commands shadow toolkit defaults)
			if (seenIds.has(command.id)) continue;
			seenIds.add(command.id);

			const displayKey = command.displayKey ?? getDisplayKey(command.keys);
			// Skip duplicates (e.g. LEFT_ARROW / RIGHT_ARROW share the same displayKey)
			const dedupeKey = `${displayKey}-${command.displayText}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);

			if (!command.isEnabled(deps)) continue;

			const entry: VisibleCommand = {
				displayKey,
				displayText: command.displayText,
				priority: command.footer === 'priority',
				footerOrder: command.footerOrder,
			};
			if (command.footer === 'priority') {
				priority.push(entry);
			} else {
				optional.push(entry);
			}
		}

		return [
			...priority.sort(
				(a, b) => (a.footerOrder ?? 999) - (b.footerOrder ?? 999),
			),
			...optional.sort(
				(a, b) => (a.footerOrder ?? 999) - (b.footerOrder ?? 999),
			),
		];
	}, [deps]);

	const value: CommandsContextValue = useMemo(
		() => ({
			handleInput,
			getVisibleCommands,
			deps,
		}),
		[handleInput, getVisibleCommands, deps],
	);

	return (
		<CommandsContext.Provider value={value}>
			{children}
		</CommandsContext.Provider>
	);
};

export const useCommands = (): CommandsContextValue => {
	const context = useContext(CommandsContext);
	if (!context) {
		throw new Error('useCommands must be used within a CommandsProvider');
	}
	return context;
};
