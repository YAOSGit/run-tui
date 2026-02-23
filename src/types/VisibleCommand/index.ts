export interface VisibleCommand {
	displayKey: string;
	displayText: string;
	/** Whether this command is always shown in the footer regardless of space. */
	priority?: boolean;
	/** Ascending sort order within the footer (lower = shown first). */
	footerOrder?: number;
}
