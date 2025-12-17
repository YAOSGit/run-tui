import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUIState } from './index.js';

describe('useUIState', () => {
	describe('initial state', () => {
		it('has showScriptSelector false by default', () => {
			const { result } = renderHook(() => useUIState());

			expect(result.current.showScriptSelector).toBe(false);
		});

		it('respects initialShowScriptSelector parameter', () => {
			const { result } = renderHook(() => useUIState(true));

			expect(result.current.showScriptSelector).toBe(true);
		});

		it('has pendingConfirmation null initially', () => {
			const { result } = renderHook(() => useUIState());

			expect(result.current.pendingConfirmation).toBeNull();
		});
	});

	describe('openScriptSelector', () => {
		it('sets showScriptSelector to true', () => {
			const { result } = renderHook(() => useUIState());

			act(() => {
				result.current.openScriptSelector();
			});

			expect(result.current.showScriptSelector).toBe(true);
		});
	});

	describe('closeScriptSelector', () => {
		it('sets showScriptSelector to false', () => {
			const { result } = renderHook(() => useUIState(true));

			act(() => {
				result.current.closeScriptSelector();
			});

			expect(result.current.showScriptSelector).toBe(false);
		});
	});

	describe('requestConfirmation', () => {
		it('sets pendingConfirmation with message and callback', () => {
			const { result } = renderHook(() => useUIState());
			const onConfirm = vi.fn();

			act(() => {
				result.current.requestConfirmation('Are you sure?', onConfirm);
			});

			expect(result.current.pendingConfirmation).toEqual({
				message: 'Are you sure?',
				onConfirm,
			});
		});
	});

	describe('confirmPending', () => {
		it('calls onConfirm callback and clears pendingConfirmation', () => {
			const { result } = renderHook(() => useUIState());
			const onConfirm = vi.fn();

			act(() => {
				result.current.requestConfirmation('Are you sure?', onConfirm);
			});

			act(() => {
				result.current.confirmPending();
			});

			expect(onConfirm).toHaveBeenCalledOnce();
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('does nothing when no pending confirmation', () => {
			const { result } = renderHook(() => useUIState());

			act(() => {
				result.current.confirmPending();
			});

			expect(result.current.pendingConfirmation).toBeNull();
		});
	});

	describe('cancelPending', () => {
		it('clears pendingConfirmation without calling callback', () => {
			const { result } = renderHook(() => useUIState());
			const onConfirm = vi.fn();

			act(() => {
				result.current.requestConfirmation('Are you sure?', onConfirm);
			});

			act(() => {
				result.current.cancelPending();
			});

			expect(onConfirm).not.toHaveBeenCalled();
			expect(result.current.pendingConfirmation).toBeNull();
		});
	});
});
