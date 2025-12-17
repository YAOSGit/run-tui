import type { Key } from 'ink';
import type React from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { useLogs } from '../LogsProvider/index.js';
import { useTasks } from '../TasksProvider/index.js';
import { useUIState } from '../UIStateProvider/index.js';
import { useView } from '../ViewProvider/index.js';
import { commands } from './CommandsProvider.commands.js';
import { CONFIRM_NO_KEYS, CONFIRM_YES_KEYS } from './CommandsProvider.consts.js';
import type {
	Command,
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
			keepAlive,
			quit: onQuit,
		}),
		[tasks, logs, view, ui, keepAlive, onQuit],
	);

	const handleInput = useCallback(
		(input: string, key: Key) => {
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

			// Find and execute matching command
			for (const command of commands) {
				if (isKeyMatch(key, input, command.keys) && command.isEnabled(providers)) {
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
		[providers, ui],
	);

	const getVisibleCommands = useCallback((): VisibleCommand[] => {
		const seen = new Set<string>();
		const visible: VisibleCommand[] = [];

		for (const command of commands) {
			const displayKey = command.displayKey ?? getDisplayKey(command.keys);

			// Skip duplicates (e.g., left/right arrows share same display)
			const key = `${displayKey}-${command.displayText}`;
			if (seen.has(key)) continue;
			seen.add(key);

			// Only show enabled commands
			if (command.isEnabled(providers)) {
				visible.push({
					displayKey,
					displayText: command.displayText,
				});
			}
		}

		return visible;
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
