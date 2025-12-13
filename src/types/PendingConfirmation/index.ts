import type { Command } from '../Command/index.js';

export interface PendingConfirmation {
	command: Command;
	message: string;
}
