/**
 * @vitest-environment happy-dom
 */
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { UIStateProvider, useUIState } from './index.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<UIStateProvider>{children}</UIStateProvider>
);

const wrapperWithScriptSelector = ({
	children,
}: {
	children: React.ReactNode;
}) => (
	<UIStateProvider initialShowScriptSelector={true}>{children}</UIStateProvider>
);

describe('UIStateProvider', () => {
	describe('useUIState hook', () => {
		it('throws error when used outside provider', () => {
			expect(() => {
				renderHook(() => useUIState());
			}).toThrow('useUIState must be used within a UIStateProvider');
		});

		it('returns context value when used within provider', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			expect(result.current).toHaveProperty('showScriptSelector');
			expect(result.current).toHaveProperty('pendingConfirmation');
			expect(result.current).toHaveProperty('openScriptSelector');
			expect(result.current).toHaveProperty('closeScriptSelector');
			expect(result.current).toHaveProperty('requestConfirmation');
			expect(result.current).toHaveProperty('confirmPending');
			expect(result.current).toHaveProperty('cancelPending');
			expect(result.current).toHaveProperty('showHelp');
			expect(result.current).toHaveProperty('openHelp');
			expect(result.current).toHaveProperty('closeHelp');
			expect(result.current).toHaveProperty('toggleHelp');
		});
	});

	describe('initial state', () => {
		it('has showScriptSelector false by default', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			expect(result.current.showScriptSelector).toBe(false);
		});

		it('has showScriptSelector true when initialShowScriptSelector is true', () => {
			const { result } = renderHook(() => useUIState(), {
				wrapper: wrapperWithScriptSelector,
			});

			expect(result.current.showScriptSelector).toBe(true);
		});

		it('has pendingConfirmation null initially', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			expect(result.current.pendingConfirmation).toBeNull();
		});
	});

	describe('script selector', () => {
		it('openScriptSelector sets showScriptSelector to true', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			act(() => {
				result.current.openScriptSelector();
			});

			expect(result.current.showScriptSelector).toBe(true);
		});

		it('closeScriptSelector sets showScriptSelector to false', () => {
			const { result } = renderHook(() => useUIState(), {
				wrapper: wrapperWithScriptSelector,
			});

			act(() => {
				result.current.closeScriptSelector();
			});

			expect(result.current.showScriptSelector).toBe(false);
		});
	});

	describe('confirmation dialog', () => {
		it('requestConfirmation sets pendingConfirmation', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });
			const onConfirm = vi.fn();

			act(() => {
				result.current.requestConfirmation('Are you sure?', onConfirm);
			});

			expect(result.current.pendingConfirmation).toEqual({
				message: 'Are you sure?',
				onConfirm,
			});
		});

		it('confirmPending calls onConfirm and clears pendingConfirmation', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });
			const onConfirm = vi.fn();

			act(() => {
				result.current.requestConfirmation('Are you sure?', onConfirm);
			});

			act(() => {
				result.current.confirmPending();
			});

			expect(onConfirm).toHaveBeenCalledTimes(1);
			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('cancelPending clears pendingConfirmation without calling onConfirm', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });
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

		it('confirmPending does nothing when no pending confirmation', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			// Should not throw
			act(() => {
				result.current.confirmPending();
			});

			expect(result.current.pendingConfirmation).toBeNull();
		});

		it('cancelPending does nothing when no pending confirmation', () => {
			const { result } = renderHook(() => useUIState(), { wrapper });

			// Should not throw
			act(() => {
				result.current.cancelPending();
			});

			expect(result.current.pendingConfirmation).toBeNull();
		});
	});
});
