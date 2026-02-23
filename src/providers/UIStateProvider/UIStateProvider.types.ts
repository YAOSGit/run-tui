import type React from 'react';
import type { LineOverflow } from '../../types/LineOverflow/index.js';

export interface UIStateProviderProps {
	children: React.ReactNode;
	initialShowScriptSelector?: boolean;
}

export interface PendingConfirmation {
	message: string;
	onConfirm: () => void;
}

export interface UIStateContextValue {
	// State
	showScriptSelector: boolean;
	showHelp: boolean;
	pendingConfirmation: PendingConfirmation | null;
	lineOverflow: LineOverflow;

	// Actions
	openScriptSelector: () => void;
	closeScriptSelector: () => void;
	requestConfirmation: (message: string, onConfirm: () => void) => void;
	confirmPending: () => void;
	cancelPending: () => void;
	cycleLineOverflow: () => void;
	openHelp: () => void;
	closeHelp: () => void;
	toggleHelp: () => void;
}
