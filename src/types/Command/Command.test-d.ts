import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { CommandProviders } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import type { KeyBinding } from '../KeyBinding/index.js';
import { type Command, getDisplayKey } from './index.js';

describe('Command type tests', () => {
	it('Command has correct required property types', () => {
		expectTypeOf<Command['id']>().toEqualTypeOf<string>();
		expectTypeOf<Command['keys']>().toEqualTypeOf<KeyBinding[]>();
		expectTypeOf<Command['displayText']>().toEqualTypeOf<string>();
	});

	it('displayKey is optional string', () => {
		expectTypeOf<Command['displayKey']>().toEqualTypeOf<string | undefined>();
	});

	it('isEnabled is a function taking CommandProviders returning boolean', () => {
		expectTypeOf<Command['isEnabled']>().toBeFunction();
		expectTypeOf<Command['isEnabled']>().parameters.toEqualTypeOf<
			[CommandProviders]
		>();
		expectTypeOf<Command['isEnabled']>().returns.toEqualTypeOf<boolean>();
	});

	it('execute is a function taking CommandProviders returning void', () => {
		expectTypeOf<Command['execute']>().toBeFunction();
		expectTypeOf<Command['execute']>().parameters.toEqualTypeOf<
			[CommandProviders]
		>();
		expectTypeOf<Command['execute']>().returns.toEqualTypeOf<void>();
	});

	it('needsConfirmation is optional function', () => {
		expectTypeOf<Command['needsConfirmation']>().toEqualTypeOf<
			((p: CommandProviders) => boolean) | undefined
		>();
	});

	it('confirmMessage can be string or function', () => {
		expectTypeOf<Command['confirmMessage']>().toEqualTypeOf<
			string | ((p: CommandProviders) => string) | undefined
		>();
	});

	it('accepts valid Command with required fields only', () => {
		assertType<Command>({
			id: 'TEST',
			keys: [{ textKey: 'q' }],
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
		});
	});

	it('accepts valid Command with all fields', () => {
		assertType<Command>({
			id: 'QUIT',
			keys: [{ textKey: 'q' }, { specialKey: 'esc' }],
			displayKey: 'q / ESC',
			displayText: 'quit',
			isEnabled: (p) => !p.ui.showScriptSelector,
			execute: (p) => p.quit(),
			needsConfirmation: (p) => p.tasks.hasRunningTasks,
			confirmMessage: (p) => `Quit with ${p.tasks.tasks.length} tasks?`,
		});
	});

	it('accepts string confirmMessage', () => {
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
			needsConfirmation: () => true,
			confirmMessage: 'Are you sure?',
		});
	});

	it('rejects missing required properties', () => {
		// @ts-expect-error - missing id
		assertType<Command>({
			keys: [],
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
		});

		// @ts-expect-error - missing keys
		assertType<Command>({
			id: 'TEST',
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
		});

		// @ts-expect-error - missing execute
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayText: 'test',
			isEnabled: () => true,
		});
	});
});

describe('getDisplayKey type tests', () => {
	it('getDisplayKey takes KeyBinding array and returns string', () => {
		expectTypeOf(getDisplayKey).toBeFunction();
		expectTypeOf(getDisplayKey).parameters.toEqualTypeOf<[KeyBinding[]]>();
		expectTypeOf(getDisplayKey).returns.toEqualTypeOf<string>();
	});

	it('getDisplayKey returns string', () => {
		const result = getDisplayKey([{ textKey: 'q' }]);
		expectTypeOf(result).toEqualTypeOf<string>();
	});
});
