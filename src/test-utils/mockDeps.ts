import { vi } from 'vitest';
import type { RunTuiDeps } from '../providers/CommandsProvider/CommandsProvider.types.js';
import type { TaskState } from '../types/TaskState/index.js';

export type MockDepsOverrides = Partial<{
	// tasks
	tasks: string[];
	pinnedTasks: string[];
	tabAliases: Record<string, string>;
	taskStates: Record<string, TaskState>;
	hasRunningTasks: boolean;
	getTaskStatus: ReturnType<typeof vi.fn>;
	/** Shorthand: sets getTaskStatus to always return this value. */
	taskStatus: string | undefined;

	// view
	activeTabIndex: number;
	activeTask: string | undefined;
	logFilter: 'stdout' | 'stderr' | null;
	primaryScrollOffset: number;
	/** Alias for primaryScrollOffset, used by older test patterns. */
	scrollOffset: number;
	primaryAutoScroll: boolean;
	/** Alias for primaryAutoScroll, used by older test patterns. */
	autoScroll: boolean;
	splitScrollOffset: number;
	splitAutoScroll: boolean;
	splitTaskName: string | null;
	activePane: 'primary' | 'split';
	showTimestamps: boolean;
	showSearch: boolean;
	searchQuery: string;
	searchMatches: number[];
	currentMatchIndex: number | null;
	showRenameInput: boolean;
	viewHeight: number;
	totalLogs: number;
	displayMode: 'full' | 'compact';

	// ui
	showScriptSelector: boolean;
	showHelp: boolean;
	pendingConfirmation: { message: string; onConfirm: () => void } | null;
	lineOverflow: 'wrap' | 'truncate' | 'truncate-end';

	// logs
	getLogsForTask: ReturnType<typeof vi.fn>;
	getLogCountForTask: ReturnType<typeof vi.fn>;

	// top level
	keepAlive: boolean;
}>;

/**
 * Creates a full RunTuiDeps mock suitable for unit-testing commands.
 * Pass overrides for any field you need to customise.
 */
export function createMockDeps(
	overrides: MockDepsOverrides = {},
): RunTuiDeps {
	return ({
		tasks: {
			tasks: overrides.tasks ?? ['task1'],
			pinnedTasks: overrides.pinnedTasks ?? [],
			tabAliases: overrides.tabAliases ?? {},
			taskStates: overrides.taskStates ?? {},
			hasRunningTasks: overrides.hasRunningTasks ?? false,
			addTask: vi.fn(),
			closeTask: vi.fn(),
			restartTask: vi.fn(),
			killTask: vi.fn(),
			killAllTasks: vi.fn(),
			cancelRestart: vi.fn(),
			markStderrSeen: vi.fn(),
			toggleTaskPin: vi.fn(),
			renameTask: vi.fn(),
			moveTaskLeft: vi.fn(),
			moveTaskRight: vi.fn(),
			getTaskStatus: overrides.getTaskStatus
				?? ('taskStatus' in overrides
					? vi.fn().mockReturnValue(overrides.taskStatus)
					: vi.fn()),
		},
		logs: {
			addLog: vi.fn(),
			getLogsForTask: overrides.getLogsForTask ?? vi.fn().mockReturnValue([]),
			getLogCountForTask: overrides.getLogCountForTask ?? vi.fn().mockReturnValue(0),
			clearLogsForTask: vi.fn(),
		},
		view: {
			activeTabIndex: overrides.activeTabIndex ?? 0,
			activeTask: 'activeTask' in overrides ? overrides.activeTask : 'task1',
			logFilter: overrides.logFilter ?? null,
			primaryScrollOffset: overrides.primaryScrollOffset ?? overrides.scrollOffset ?? 0,
			primaryAutoScroll: overrides.primaryAutoScroll ?? overrides.autoScroll ?? true,
			splitScrollOffset: overrides.splitScrollOffset ?? 0,
			splitAutoScroll: overrides.splitAutoScroll ?? true,
			splitTaskName: overrides.splitTaskName ?? null,
			activePane: overrides.activePane ?? 'primary',
			showTimestamps: overrides.showTimestamps ?? false,
			showSearch: overrides.showSearch ?? false,
			searchQuery: overrides.searchQuery ?? '',
			searchMatches: overrides.searchMatches ?? [],
			currentMatchIndex: 'currentMatchIndex' in overrides ? overrides.currentMatchIndex ?? -1 : -1,
			showRenameInput: overrides.showRenameInput ?? false,
			viewHeight: overrides.viewHeight ?? 20,
			totalLogs: overrides.totalLogs ?? 10,
			displayMode: overrides.displayMode ?? ('full' as const),
			navigateLeft: vi.fn(),
			navigateRight: vi.fn(),
			setActiveTabIndex: vi.fn(),
			cycleLogFilter: vi.fn(),
			scrollUp: vi.fn(),
			scrollDown: vi.fn(),
			scrollToBottom: vi.fn(),
			nextMatch: vi.fn(),
			prevMatch: vi.fn(),
			toggleTimestamps: vi.fn(),
			openSearch: vi.fn(),
			closeSearch: vi.fn(),
			openRenameInput: vi.fn(),
			closeRenameInput: vi.fn(),
			setSearchQuery: vi.fn(),
			scrollToIndex: vi.fn(),
			toggleDisplayMode: vi.fn(),
			cyclePaneFocus: vi.fn(),
		},
		ui: {
			// UIStateContextValue fields
			showScriptSelector: overrides.showScriptSelector ?? false,
			showHelp: overrides.showHelp ?? false,
			pendingConfirmation: overrides.pendingConfirmation ?? null,
			lineOverflow: overrides.lineOverflow ?? ('wrap' as const),
			openScriptSelector: vi.fn(),
			closeScriptSelector: vi.fn(),
			requestConfirmation: vi.fn(),
			confirmPending: vi.fn(),
			cancelPending: vi.fn(),
			cycleLineOverflow: vi.fn(),
			openHelp: vi.fn(),
			closeHelp: vi.fn(),
			toggleHelp: vi.fn(),

			// OverlayState fields
			activeOverlay: overrides.showHelp
				? 'help'
				: overrides.showScriptSelector
					? 'selector'
					: overrides.showSearch
						? 'search'
						: overrides.showRenameInput
							? 'rename'
							: overrides.pendingConfirmation
								? 'confirmation'
								: 'none',
			setActiveOverlay: vi.fn(),
			confirmation: overrides.pendingConfirmation ?? null,
			clearConfirmation: vi.fn(),

			// cycleFocus (BaseDeps requirement)
			cycleFocus: vi.fn(),
		},
		keepAlive: overrides.keepAlive ?? false,
		onQuit: vi.fn(),
	}) as unknown as RunTuiDeps;
}
