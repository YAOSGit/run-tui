import type { Key } from 'ink';
import type { CommandContext } from '../../types/CommandContext/index.js';
import type { PendingConfirmation } from '../../types/PendingConfirmation/index.js';
import type { VisibleCommand } from '../../types/VisibleCommand/index.js';

export interface UseCommandRegistryOptions {
	context: CommandContext;
}

export interface UseCommandRegistryReturn {
	handleInput: (input: string, key: Key) => void;
	getVisibleCommands: () => VisibleCommand[];
	pendingConfirmation: PendingConfirmation | null;
}
