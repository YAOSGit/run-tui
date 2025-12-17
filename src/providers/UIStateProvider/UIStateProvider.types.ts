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
	pendingConfirmation: PendingConfirmation | null;

	// Actions
	openScriptSelector: () => void;
	closeScriptSelector: () => void;
	requestConfirmation: (message: string, onConfirm: () => void) => void;
	confirmPending: () => void;
	cancelPending: () => void;
}
