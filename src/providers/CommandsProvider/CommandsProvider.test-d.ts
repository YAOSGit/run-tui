import { describe, expectTypeOf, it } from 'vitest';
import type {
	CommandProviders,
	CommandsContextValue,
	CommandsProviderProps,
	RunTuiCommand,
	RunTuiDeps,
	RunTuiUI,
} from './CommandsProvider.types.js';

describe('CommandsProviderProps', () => {
	it('has children property', () => {
		expectTypeOf<CommandsProviderProps>().toHaveProperty('children');
	});

	it('has optional keepAlive', () => {
		expectTypeOf<CommandsProviderProps>().toMatchTypeOf<{ keepAlive?: boolean }>();
	});

	it('has optional onQuit', () => {
		expectTypeOf<CommandsProviderProps>().toMatchTypeOf<{ onQuit?: () => void }>();
	});
});

describe('RunTuiUI', () => {
	it('has cycleFocus function', () => {
		expectTypeOf<RunTuiUI>().toHaveProperty('cycleFocus');
		expectTypeOf<RunTuiUI['cycleFocus']>().toBeFunction();
	});

	it('inherits UIStateContextValue properties', () => {
		expectTypeOf<RunTuiUI>().toHaveProperty('showScriptSelector');
		expectTypeOf<RunTuiUI>().toHaveProperty('showHelp');
		expectTypeOf<RunTuiUI>().toHaveProperty('openHelp');
		expectTypeOf<RunTuiUI>().toHaveProperty('closeHelp');
	});

	it('inherits OverlayState properties', () => {
		expectTypeOf<RunTuiUI>().toHaveProperty('activeOverlay');
		expectTypeOf<RunTuiUI>().toHaveProperty('setActiveOverlay');
		expectTypeOf<RunTuiUI>().toHaveProperty('confirmation');
		expectTypeOf<RunTuiUI>().toHaveProperty('requestConfirmation');
		expectTypeOf<RunTuiUI>().toHaveProperty('clearConfirmation');
	});
});

describe('RunTuiDeps', () => {
	it('has ui property of type RunTuiUI', () => {
		expectTypeOf<RunTuiDeps>().toHaveProperty('ui');
		expectTypeOf<RunTuiDeps['ui']>().toMatchTypeOf<RunTuiUI>();
	});

	it('has tasks, logs, and view context values', () => {
		expectTypeOf<RunTuiDeps>().toHaveProperty('tasks');
		expectTypeOf<RunTuiDeps>().toHaveProperty('logs');
		expectTypeOf<RunTuiDeps>().toHaveProperty('view');
	});

	it('has keepAlive boolean', () => {
		expectTypeOf<RunTuiDeps>().toHaveProperty('keepAlive');
		expectTypeOf<RunTuiDeps['keepAlive']>().toEqualTypeOf<boolean>();
	});

	it('inherits onQuit from BaseDeps', () => {
		expectTypeOf<RunTuiDeps>().toHaveProperty('onQuit');
	});
});

describe('RunTuiCommand', () => {
	it('has keys property', () => {
		expectTypeOf<RunTuiCommand>().toHaveProperty('keys');
	});

	it('has execute function', () => {
		expectTypeOf<RunTuiCommand>().toHaveProperty('execute');
	});

	it('has optional needsConfirmation function', () => {
		expectTypeOf<RunTuiCommand>().toMatchTypeOf<{
			needsConfirmation?: (deps: RunTuiDeps) => boolean;
		}>();
	});

	it('has optional confirmMessage', () => {
		expectTypeOf<RunTuiCommand>().toHaveProperty('confirmMessage');
	});
});

describe('CommandProviders', () => {
	it('has tasks, logs, ui, and view properties', () => {
		expectTypeOf<CommandProviders>().toHaveProperty('tasks');
		expectTypeOf<CommandProviders>().toHaveProperty('logs');
		expectTypeOf<CommandProviders>().toHaveProperty('ui');
		expectTypeOf<CommandProviders>().toHaveProperty('view');
	});

	it('has keepAlive boolean', () => {
		expectTypeOf<CommandProviders['keepAlive']>().toEqualTypeOf<boolean>();
	});

	it('has quit function', () => {
		expectTypeOf<CommandProviders['quit']>().toBeFunction();
		expectTypeOf<CommandProviders['quit']>().returns.toBeVoid();
	});
});

describe('CommandsContextValue', () => {
	it('has handleInput function', () => {
		expectTypeOf<CommandsContextValue>().toHaveProperty('handleInput');
		expectTypeOf<CommandsContextValue['handleInput']>().toBeFunction();
	});

	it('has getVisibleCommands function', () => {
		expectTypeOf<CommandsContextValue>().toHaveProperty('getVisibleCommands');
		expectTypeOf<CommandsContextValue['getVisibleCommands']>().toBeFunction();
	});

	it('has deps of type RunTuiDeps', () => {
		expectTypeOf<CommandsContextValue>().toHaveProperty('deps');
		expectTypeOf<CommandsContextValue['deps']>().toMatchTypeOf<RunTuiDeps>();
	});
});
