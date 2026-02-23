import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useViewState } from '../../hooks/useView/index.js';
import { useLogs } from '../LogsProvider/index.js';
import { useTasks } from '../TasksProvider/index.js';
import type {
	ViewContextValue,
	ViewProviderProps,
} from './ViewProvider.types.js';

const ViewContext = createContext<ViewContextValue | null>(null);

export const ViewProvider: React.FC<ViewProviderProps> = ({
	children,
	viewHeight,
}) => {
	const { tasks, pinnedTasks, markStderrSeen } = useTasks();
	const { getLogsForTask, getLogCountForTask } = useLogs();

	const viewState = useViewState({
		viewHeight,
		tasks,
		pinnedTasks,
		getLogCountForTask,
		getLogsForTask,
		markStderrSeen,
	});

	const value: ViewContextValue = useMemo(
		() => ({
			activeTabIndex: viewState.activeTabIndex,
			activeTask: viewState.activeTask,
			logFilter: viewState.logFilter,
			primaryScrollOffset: viewState.primaryScrollOffset,
			primaryAutoScroll: viewState.primaryAutoScroll,
			splitScrollOffset: viewState.splitScrollOffset,
			splitAutoScroll: viewState.splitAutoScroll,
			splitTaskName: viewState.splitTaskName,
			activePane: viewState.activePane,
			showTimestamps: viewState.showTimestamps,
			showSearch: viewState.showSearch,
			searchQuery: viewState.searchQuery,
			searchMatches: viewState.searchMatches,
			currentMatchIndex: viewState.currentMatchIndex,
			showRenameInput: viewState.showRenameInput,
			viewHeight: viewState.viewHeight,
			totalLogs: viewState.totalLogs,
			focusMode: viewState.focusMode,
			displayMode: viewState.displayMode,
			navigateLeft: viewState.navigateLeft,
			navigateRight: viewState.navigateRight,
			setActiveTabIndex: viewState.setActiveTabIndex,
			cycleLogFilter: viewState.cycleLogFilter,
			scrollUp: viewState.scrollUp,
			scrollDown: viewState.scrollDown,
			scrollToBottom: viewState.scrollToBottom,
			toggleTimestamps: viewState.toggleTimestamps,
			openSearch: viewState.openSearch,
			closeSearch: viewState.closeSearch,
			openRenameInput: viewState.openRenameInput,
			closeRenameInput: viewState.closeRenameInput,
			setSearchQuery: viewState.setSearchQuery,
			scrollToIndex: viewState.scrollToIndex,
			toggleFocusMode: viewState.toggleFocusMode,
			toggleDisplayMode: viewState.toggleDisplayMode,
			cyclePaneFocus: viewState.cyclePaneFocus,
			nextMatch: viewState.nextMatch,
			prevMatch: viewState.prevMatch,
		}),
		[viewState],
	);

	return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useView = (): ViewContextValue => {
	const context = useContext(ViewContext);
	if (!context) {
		throw new Error('useView must be used within a ViewProvider');
	}
	return context;
};
