import { describe, expectTypeOf, it } from 'vitest';
import type { ViewContextValue, ViewProviderProps } from './ViewProvider.types.js';

describe('ViewProviderProps', () => {
	it('has children property', () => {
		expectTypeOf<ViewProviderProps>().toHaveProperty('children');
	});

	it('has viewHeight as number', () => {
		expectTypeOf<ViewProviderProps>().toHaveProperty('viewHeight');
		expectTypeOf<ViewProviderProps['viewHeight']>().toEqualTypeOf<number>();
	});
});

describe('ViewContextValue', () => {
	it('has activeTabIndex as number', () => {
		expectTypeOf<ViewContextValue>().toHaveProperty('activeTabIndex');
		expectTypeOf<ViewContextValue['activeTabIndex']>().toEqualTypeOf<number>();
	});

	it('has activeTask as string or undefined', () => {
		expectTypeOf<ViewContextValue>().toHaveProperty('activeTask');
		expectTypeOf<ViewContextValue['activeTask']>().toEqualTypeOf<string | undefined>();
	});

	it('has logFilter property', () => {
		expectTypeOf<ViewContextValue>().toHaveProperty('logFilter');
	});

	it('has primary pane scroll properties', () => {
		expectTypeOf<ViewContextValue['primaryScrollOffset']>().toEqualTypeOf<number>();
		expectTypeOf<ViewContextValue['primaryAutoScroll']>().toEqualTypeOf<boolean>();
	});

	it('has split pane properties', () => {
		expectTypeOf<ViewContextValue['activePane']>().toEqualTypeOf<'primary' | 'split'>();
		expectTypeOf<ViewContextValue['splitTaskName']>().toEqualTypeOf<string | null>();
		expectTypeOf<ViewContextValue['splitScrollOffset']>().toEqualTypeOf<number>();
		expectTypeOf<ViewContextValue['splitAutoScroll']>().toEqualTypeOf<boolean>();
	});

	it('has display properties', () => {
		expectTypeOf<ViewContextValue['showTimestamps']>().toEqualTypeOf<boolean>();
		expectTypeOf<ViewContextValue['showSearch']>().toEqualTypeOf<boolean>();
		expectTypeOf<ViewContextValue['searchQuery']>().toEqualTypeOf<string>();
		expectTypeOf<ViewContextValue['searchMatches']>().toEqualTypeOf<number[]>();
		expectTypeOf<ViewContextValue['showRenameInput']>().toEqualTypeOf<boolean>();
		expectTypeOf<ViewContextValue['viewHeight']>().toEqualTypeOf<number>();
		expectTypeOf<ViewContextValue['totalLogs']>().toEqualTypeOf<number>();
		expectTypeOf<ViewContextValue['displayMode']>().toEqualTypeOf<'full' | 'compact'>();
	});

	it('has currentMatchIndex as number or null', () => {
		expectTypeOf<ViewContextValue['currentMatchIndex']>().toEqualTypeOf<number | null>();
	});

	it('has navigation action methods returning void', () => {
		expectTypeOf<ViewContextValue['navigateLeft']>().toBeFunction();
		expectTypeOf<ViewContextValue['navigateLeft']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['navigateRight']>().toBeFunction();
		expectTypeOf<ViewContextValue['navigateRight']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['setActiveTabIndex']>().toBeFunction();
		expectTypeOf<ViewContextValue['cycleLogFilter']>().toBeFunction();
	});

	it('has scroll action methods returning void', () => {
		expectTypeOf<ViewContextValue['scrollUp']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['scrollDown']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['scrollToBottom']>().returns.toBeVoid();
	});

	it('has toggle action methods returning void', () => {
		expectTypeOf<ViewContextValue['toggleTimestamps']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['toggleDisplayMode']>().returns.toBeVoid();
	});

	it('has search action methods', () => {
		expectTypeOf<ViewContextValue['openSearch']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['closeSearch']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['setSearchQuery']>().toBeFunction();
		expectTypeOf<ViewContextValue['nextMatch']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['prevMatch']>().returns.toBeVoid();
	});

	it('has rename input methods', () => {
		expectTypeOf<ViewContextValue['openRenameInput']>().returns.toBeVoid();
		expectTypeOf<ViewContextValue['closeRenameInput']>().returns.toBeVoid();
	});

	it('has scrollToIndex and cyclePaneFocus methods', () => {
		expectTypeOf<ViewContextValue['scrollToIndex']>().toBeFunction();
		expectTypeOf<ViewContextValue['cyclePaneFocus']>().returns.toBeVoid();
	});
});
