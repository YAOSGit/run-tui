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

	// Pane 1 (Primary)
	primaryScrollOffset: number;
	primaryAutoScroll: boolean;

	// Pane 2 (Split)
	activePane: 'primary' | 'split';
	splitTaskName: string | null;
	splitScrollOffset: number;
	splitAutoScroll: boolean;
	showTimestamps: boolean;
	showSearch: boolean;
	searchQuery: string;
	searchMatches: number[];
	currentMatchIndex: number | null;
	showRenameInput: boolean;
	viewHeight: number;
	totalLogs: number;
	focusMode: boolean;
	displayMode: 'full' | 'compact';

	// High-level Actions
	navigateLeft: () => void;
	navigateRight: () => void;
	setActiveTabIndex: (index: number) => void;
	cycleLogFilter: () => void;
	scrollUp: () => void;
	scrollDown: () => void;
	scrollToBottom: () => void;
	toggleTimestamps: () => void;
	openSearch: () => void;
	closeSearch: () => void;
	openRenameInput: () => void;
	closeRenameInput: () => void;
	setSearchQuery: (query: string) => void;
	scrollToIndex: (index: number, total: number) => void;
	toggleFocusMode: () => void;
	toggleDisplayMode: () => void;
	cyclePaneFocus: () => void;
	nextMatch: () => void;
	prevMatch: () => void;
}
