import type { Key } from 'ink';
import { useCallback, useState } from 'react';
import { commands } from '../../commands/index.js';
import { getDisplayKey } from '../../types/Command/index.js';
import type { CommandContext } from '../../types/CommandContext/index.js';
import type { PendingConfirmation } from '../../types/PendingConfirmation/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';
import { isKeyMatch } from './useCommandRegistry.utils.js';

const CONFIRM_YES_KEYS = [
	{ textKey: 'y', ctrl: false },
	{ specialKey: 'enter', ctrl: false },
];

const CONFIRM_NO_KEYS = [
	{ textKey: 'n', ctrl: false },
	{ specialKey: 'esc', ctrl: false },
];

export const useCommandRegistry = (context: CommandContext) => {
	const [pendingConfirmation, setPendingConfirmation] =
		useState<PendingConfirmation | null>(null);

	const handleInput = useCallback(
		(input: string, key: Key) => {
			// Handle confirmation mode
			if (pendingConfirmation) {
				// Confirm with y, Enter, or the same key that triggered the confirmation
				if (
					isKeyMatch(key, input, CONFIRM_YES_KEYS) ||
					isKeyMatch(key, input, pendingConfirmation.command.keys)
				) {
					pendingConfirmation.command.execute(context);
					setPendingConfirmation(null);
					return;
				}
				if (isKeyMatch(key, input, CONFIRM_NO_KEYS)) {
					setPendingConfirmation(null);
					return;
				}
				// Ignore other keys during confirmation
				return;
			}

			// Find and execute matching command
			for (const command of commands) {
				if (
					isKeyMatch(key, input, command.keys) &&
					command.isEnabled(context)
				) {
					// Check if command needs confirmation
					if (command.needsConfirmation?.(context)) {
						const message =
							typeof command.confirmMessage === 'function'
								? command.confirmMessage(context)
								: (command.confirmMessage ?? 'Are you sure?');
						setPendingConfirmation({ command, message });
						return;
					}

					// Execute directly
					command.execute(context);
					return;
				}
			}
		},
		[context, pendingConfirmation],
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
			if (command.isEnabled(context)) {
				visible.push({
					displayKey,
					displayText: command.displayText,
				});
			}
		}

		return visible;
	}, [context]);

	return {
		handleInput,
		getVisibleCommands,
		pendingConfirmation,
	};
};
