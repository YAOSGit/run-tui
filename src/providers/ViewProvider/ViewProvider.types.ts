import type { LogType } from '../../types/LogType/index.js';

export interface ViewProviderProps {
	children: React.ReactNode;
	viewHeight: number;
}

export interface ViewContextValue {
	// State
	activeTabIndex: number;
	activeTask: string | undefined;
	logFilter: LogType | null;
	scrollOffset: number;
	autoScroll: boolean;
	viewHeight: number;
	totalLogs: number;

	// High-level Actions
	navigateLeft: () => void;
	navigateRight: () => void;
	setActiveTabIndex: (index: number) => void;
	cycleLogFilter: () => void;
	scrollUp: () => void;
	scrollDown: () => void;
	scrollToBottom: () => void;
}
