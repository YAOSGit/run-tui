import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useUIState as useUIStateHook } from '../../hooks/useUIState/index.js';
import type {
	UIStateContextValue,
	UIStateProviderProps,
} from './UIStateProvider.types.js';

const UIStateContext = createContext<UIStateContextValue | null>(null);

export const UIStateProvider: React.FC<UIStateProviderProps> = ({
	children,
	initialShowScriptSelector = false,
}) => {
	const uiState = useUIStateHook(initialShowScriptSelector);

	const value: UIStateContextValue = useMemo(
		() => ({
			showScriptSelector: uiState.showScriptSelector,
			pendingConfirmation: uiState.pendingConfirmation,
			openScriptSelector: uiState.openScriptSelector,
			closeScriptSelector: uiState.closeScriptSelector,
			requestConfirmation: uiState.requestConfirmation,
			confirmPending: uiState.confirmPending,
			cancelPending: uiState.cancelPending,
		}),
		[uiState],
	);

	return (
		<UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>
	);
};

export const useUIState = (): UIStateContextValue => {
	const context = useContext(UIStateContext);
	if (!context) {
		throw new Error('useUIState must be used within a UIStateProvider');
	}
	return context;
};
