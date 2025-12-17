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
	const { tasks, markStderrSeen } = useTasks();
	const { getLogCountForTask } = useLogs();

	const viewState = useViewState({
		viewHeight,
		tasks,
		getLogCountForTask,
		markStderrSeen,
	});

	const value: ViewContextValue = useMemo(
		() => ({
			activeTabIndex: viewState.activeTabIndex,
			activeTask: viewState.activeTask,
			logFilter: viewState.logFilter,
			scrollOffset: viewState.scrollOffset,
			autoScroll: viewState.autoScroll,
			viewHeight: viewState.viewHeight,
			totalLogs: viewState.totalLogs,
			navigateLeft: viewState.navigateLeft,
			navigateRight: viewState.navigateRight,
			setActiveTabIndex: viewState.setActiveTabIndex,
			cycleLogFilter: viewState.cycleLogFilter,
			scrollUp: viewState.scrollUp,
			scrollDown: viewState.scrollDown,
			scrollToBottom: viewState.scrollToBottom,
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
