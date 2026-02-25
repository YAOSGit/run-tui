import type { Key } from 'ink';
import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import type { Command } from '../../types/Command/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { useLogs } from '../LogsProvider/index.js';
import { useTasks } from '../TasksProvider/index.js';
import { useUIState } from '../UIStateProvider/index.js';
import { useView } from '../ViewProvider/index.js';
import {
	COMMANDS,
	CONFIRM_NO_KEYS,
	CONFIRM_YES_KEYS,
} from './CommandsProvider.consts.js';
import type {
	CommandProviders,
	CommandsContextValue,
	CommandsProviderProps,
} from './CommandsProvider.types.js';
import { getDisplayKey, isKeyMatch } from './CommandsProvider.utils.js';

const CommandsContext = createContext<CommandsContextValue | null>(null);

export const CommandsProvider: React.FC<CommandsProviderProps> = ({
	children,
	keepAlive,
	onQuit,
}) => {
	const tasks = useTasks();
	const logs = useLogs();
	const view = useView();
	const ui = useUIState();

	// Track the command that requested confirmation (for matching repeat key)
	const pendingCommandRef = useRef<Command | null>(null);

	// Build the providers object that commands receive
	const providers: CommandProviders = useMemo(
		() => ({
			tasks,
			logs,
			view,
			ui,
			keepAlive: keepAlive ?? false,
			quit: onQuit ?? (() => {}),
		}),
		[tasks, logs, view, ui, keepAlive, onQuit],
	);

	const handleInput = useCallback(
		(input: string, key: Key) => {
			if (view.showSearch) {
				return;
			}

			// Handle confirmation mode
			if (ui.pendingConfirmation) {
				// Confirm with y, Enter, or the same key that triggered the confirmation
				if (
					isKeyMatch(key, input, CONFIRM_YES_KEYS) ||
					(pendingCommandRef.current &&
						isKeyMatch(key, input, pendingCommandRef.current.keys))
				) {
					ui.confirmPending();
					pendingCommandRef.current = null;
					return;
				}
				if (isKeyMatch(key, input, CONFIRM_NO_KEYS)) {
					ui.cancelPending();
					pendingCommandRef.current = null;
					return;
				}
				// Ignore other keys during confirmation
				return;
			}

			// Ignore global commands if typing in an input overlay
			if (
				providers.ui.showHelp ||
				providers.view.showSearch ||
				providers.view.showRenameInput
			) {
				return;
			}

			// Find and execute matching command
			for (const command of COMMANDS) {
				if (
					isKeyMatch(key, input, command.keys) &&
					command.isEnabled(providers)
				) {
					// Check if command needs confirmation
					if (command.needsConfirmation?.(providers)) {
						const message =
							typeof command.confirmMessage === 'function'
								? command.confirmMessage(providers)
								: (command.confirmMessage ?? 'Are you sure?');
						pendingCommandRef.current = command;
						ui.requestConfirmation(message, () => command.execute(providers));
						return;
					}

					// Execute directly
					command.execute(providers);
					return;
				}
			}
		},
		[providers, ui, providers.ui.showHelp, view.showSearch],
	);

	const getVisibleCommands = useCallback((): VisibleCommand[] => {
		const seen = new Set<string>();
		const priority: VisibleCommand[] = [];
		const optional: VisibleCommand[] = [];

		for (const command of COMMANDS) {
			if (command.footer === 'hidden') continue;

			const displayKey = command.displayKey ?? getDisplayKey(command.keys);
			// Skip duplicates (e.g. LEFT_ARROW / RIGHT_ARROW share the same displayKey)
			const dedupeKey = `${displayKey}-${command.displayText}`;
			if (seen.has(dedupeKey)) continue;
			seen.add(dedupeKey);

			if (!command.isEnabled(providers)) continue;

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
	}, [providers]);

	const value: CommandsContextValue = useMemo(
		() => ({
			handleInput,
			getVisibleCommands,
		}),
		[handleInput, getVisibleCommands],
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
