import { useCallback, useState } from 'react';
import type { LineOverflow } from '../../types/LineOverflow/index.js';
import { LINE_OVERFLOW } from '../../types/LineOverflow/index.js';
import type { PendingConfirmation } from './useUIState.types.js';

const LINE_OVERFLOW_CYCLE: LineOverflow[] = [
	LINE_OVERFLOW.WRAP,
	LINE_OVERFLOW.TRUNCATE,
	LINE_OVERFLOW.TRUNCATE_END,
];

export const useUIState = (initialShowScriptSelector = false) => {
	const [showScriptSelector, setShowScriptSelector] = useState(
		initialShowScriptSelector,
	);
	const [showHelp, setShowHelp] = useState(false);
	const [pendingConfirmation, setPendingConfirmation] =
		useState<PendingConfirmation | null>(null);
	const [lineOverflow, setLineOverflow] = useState<LineOverflow>(
		LINE_OVERFLOW.WRAP,
	);

	const openScriptSelector = useCallback(() => {
		setShowScriptSelector(true);
	}, []);

	const closeScriptSelector = useCallback(() => {
		setShowScriptSelector(false);
	}, []);

	const openHelp = useCallback(() => {
		setShowHelp(true);
	}, []);

	const closeHelp = useCallback(() => {
		setShowHelp(false);
	}, []);

	const toggleHelp = useCallback(() => {
		setShowHelp((prev) => !prev);
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

	const cycleLineOverflow = useCallback(() => {
		setLineOverflow((prev) => {
			const currentIndex = LINE_OVERFLOW_CYCLE.indexOf(prev);
			const nextIndex = (currentIndex + 1) % LINE_OVERFLOW_CYCLE.length;
			return LINE_OVERFLOW_CYCLE[nextIndex];
		});
	}, []);

	return {
		showScriptSelector,
		showHelp,
		pendingConfirmation,
		lineOverflow,
		openScriptSelector,
		closeScriptSelector,
		requestConfirmation,
		confirmPending,
		cancelPending,
		cycleLineOverflow,
		openHelp,
		closeHelp,
		toggleHelp,
	};
};
