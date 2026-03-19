import { assertType, describe, expectTypeOf, it } from 'vitest';
import type {
	PendingConfirmation,
	UIStateContextValue,
	UIStateProviderProps,
} from './UIStateProvider.types.js';

describe('UIStateProviderProps', () => {
	it('has children property', () => {
		expectTypeOf<UIStateProviderProps>().toHaveProperty('children');
	});

	it('has optional initialShowScriptSelector', () => {
		expectTypeOf<UIStateProviderProps>().toMatchTypeOf<{
			initialShowScriptSelector?: boolean;
		}>();
	});
});

describe('PendingConfirmation', () => {
	it('has message and onConfirm properties', () => {
		expectTypeOf<PendingConfirmation>().toHaveProperty('message');
		expectTypeOf<PendingConfirmation['message']>().toEqualTypeOf<string>();
		expectTypeOf<PendingConfirmation>().toHaveProperty('onConfirm');
		expectTypeOf<PendingConfirmation['onConfirm']>().toBeFunction();
		expectTypeOf<PendingConfirmation['onConfirm']>().returns.toBeVoid();
	});

	it('accepts valid PendingConfirmation objects', () => {
		assertType<PendingConfirmation>({
			message: 'Are you sure?',
			onConfirm: () => {},
		});
	});
});

describe('UIStateContextValue', () => {
	it('has boolean state properties', () => {
		expectTypeOf<UIStateContextValue['showScriptSelector']>().toEqualTypeOf<boolean>();
		expectTypeOf<UIStateContextValue['showHelp']>().toEqualTypeOf<boolean>();
	});

	it('has pendingConfirmation as PendingConfirmation or null', () => {
		expectTypeOf<UIStateContextValue['pendingConfirmation']>().toEqualTypeOf<PendingConfirmation | null>();
	});

	it('has lineOverflow property', () => {
		expectTypeOf<UIStateContextValue>().toHaveProperty('lineOverflow');
	});

	it('has script selector actions', () => {
		expectTypeOf<UIStateContextValue['openScriptSelector']>().toBeFunction();
		expectTypeOf<UIStateContextValue['openScriptSelector']>().returns.toBeVoid();
		expectTypeOf<UIStateContextValue['closeScriptSelector']>().toBeFunction();
		expectTypeOf<UIStateContextValue['closeScriptSelector']>().returns.toBeVoid();
	});

	it('has confirmation actions', () => {
		expectTypeOf<UIStateContextValue['requestConfirmation']>().toBeFunction();
		expectTypeOf<UIStateContextValue['confirmPending']>().toBeFunction();
		expectTypeOf<UIStateContextValue['confirmPending']>().returns.toBeVoid();
		expectTypeOf<UIStateContextValue['cancelPending']>().toBeFunction();
		expectTypeOf<UIStateContextValue['cancelPending']>().returns.toBeVoid();
	});

	it('has help actions', () => {
		expectTypeOf<UIStateContextValue['openHelp']>().returns.toBeVoid();
		expectTypeOf<UIStateContextValue['closeHelp']>().returns.toBeVoid();
		expectTypeOf<UIStateContextValue['toggleHelp']>().returns.toBeVoid();
	});

	it('has cycleLineOverflow action', () => {
		expectTypeOf<UIStateContextValue['cycleLineOverflow']>().toBeFunction();
		expectTypeOf<UIStateContextValue['cycleLineOverflow']>().returns.toBeVoid();
	});
});
