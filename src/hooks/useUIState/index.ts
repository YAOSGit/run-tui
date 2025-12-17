import { useCallback, useState } from 'react';
import type { PendingConfirmation } from './useUIState.types.js';

export const useUIState = (initialShowScriptSelector = false) => {
	const [showScriptSelector, setShowScriptSelector] = useState(
		initialShowScriptSelector,
	);
	const [pendingConfirmation, setPendingConfirmation] =
		useState<PendingConfirmation | null>(null);

	const openScriptSelector = useCallback(() => {
		setShowScriptSelector(true);
	}, []);

	const closeScriptSelector = useCallback(() => {
		setShowScriptSelector(false);
	}, []);

	const requestConfirmation = useCallback(
		(message: string, onConfirm: () => void) => {
			setPendingConfirmation({ message, onConfirm });
		},
		[],
	);

	const confirmPending = useCallback(() => {
		if (pendingConfirmation) {
			pendingConfirmation.onConfirm();
			setPendingConfirmation(null);
		}
	}, [pendingConfirmation]);

	const cancelPending = useCallback(() => {
		setPendingConfirmation(null);
	}, []);

	return {
		showScriptSelector,
		pendingConfirmation,
		openScriptSelector,
		closeScriptSelector,
		requestConfirmation,
		confirmPending,
		cancelPending,
	};
};
