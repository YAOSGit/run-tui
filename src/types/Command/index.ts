import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import type { KeyBinding } from '../KeyBinding/index.js';

export type Command = {
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
};
