import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { RunTuiDeps } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { getDisplayKey } from '../../providers/CommandsProvider/CommandsProvider.utils.js';
import type { KeyBinding } from '../KeyBinding/index.js';
import type { Command } from './index.js';

describe('Command type tests', () => {
	it('Command has correct required property types', () => {
		expectTypeOf<Command['id']>().toEqualTypeOf<string>();
		expectTypeOf<Command['keys']>().toEqualTypeOf<KeyBinding[]>();
		expectTypeOf<Command['displayText']>().toEqualTypeOf<string>();
	});

	it('displayKey is a string (required by toolkit Command)', () => {
		expectTypeOf<Command['displayKey']>().toEqualTypeOf<string>();
	});

	it('isEnabled is a function taking RunTuiDeps returning boolean', () => {
		expectTypeOf<Command['isEnabled']>().toBeFunction();
		expectTypeOf<Command['isEnabled']>().parameters.toEqualTypeOf<
			[RunTuiDeps]
		>();
		expectTypeOf<Command['isEnabled']>().returns.toEqualTypeOf<boolean>();
	});

	it('execute is a function taking RunTuiDeps returning void', () => {
		expectTypeOf<Command['execute']>().toBeFunction();
		expectTypeOf<Command['execute']>().parameters.toEqualTypeOf<
			[RunTuiDeps]
		>();
		expectTypeOf<Command['execute']>().returns.toEqualTypeOf<void>();
	});

	it('needsConfirmation is optional function', () => {
		expectTypeOf<Command['needsConfirmation']>().toEqualTypeOf<
			((deps: RunTuiDeps) => boolean) | undefined
		>();
	});

	it('confirmMessage can be string or function', () => {
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayKey: '',
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
			confirmMessage: 'Are you sure?',
		});
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayKey: '',
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
			confirmMessage: (_deps: RunTuiDeps) => 'Are you sure?',
		});
	});

	it('accepts valid Command with required fields only', () => {
		assertType<Command>({
			id: 'TEST',
			keys: [{ textKey: 'q' }],
			displayKey: 'q',
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
			isEnabled: (deps) => deps.ui.activeOverlay === 'none',
			execute: (deps) => deps.onQuit(),
			needsConfirmation: (deps) => deps.tasks.hasRunningTasks,
			confirmMessage: (deps) => `Quit with ${deps.tasks.tasks.length} tasks?`,
		});
	});

	it('accepts string confirmMessage', () => {
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayKey: '',
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
			displayKey: '',
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
		});

		// @ts-expect-error - missing keys
		assertType<Command>({
			id: 'TEST',
			displayKey: '',
			displayText: 'test',
			isEnabled: () => true,
			execute: () => {},
		});

		// @ts-expect-error - missing execute
		assertType<Command>({
			id: 'TEST',
			keys: [],
			displayKey: '',
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
