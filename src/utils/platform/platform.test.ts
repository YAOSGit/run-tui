import { describe, expect, it, vi } from 'vitest';

describe('platform utils', () => {
	describe('MOD_KEY', () => {
		it('returns "opt" on macOS', async () => {
			vi.stubGlobal('process', { ...process, platform: 'darwin' });

			const { MOD_KEY } = await import('./index.js');

			expect(MOD_KEY).toBe('opt');

			vi.unstubAllGlobals();
		});
	});

	describe('modKey', () => {
		it('formats key with modifier using non-breaking spaces', async () => {
			const { modKey } = await import('./index.js');

			const result = modKey('f');

			expect(result).toContain('f');
			expect(result).toContain('+');
			// Contains non-breaking spaces
			expect(result).toContain('\xA0');
		});
	});

	describe('modKeyBindings', () => {
		it('returns composed character binding on macOS', async () => {
			vi.stubGlobal('process', { ...process, platform: 'darwin' });

			// Need a fresh import to pick up the platform change
			vi.resetModules();
			const { modKeyBindings } = await import('./index.js');

			const bindings = modKeyBindings('f');

			expect(bindings).toHaveLength(1);
			expect(bindings[0].textKey).toBe('\u0192'); // ƒ
			expect(bindings[0].meta).toBe(false);

			vi.unstubAllGlobals();
		});

		it('returns meta binding on non-macOS platforms', async () => {
			vi.stubGlobal('process', { ...process, platform: 'linux' });

			vi.resetModules();
			const { modKeyBindings } = await import('./index.js');

			const bindings = modKeyBindings('f');

			expect(bindings).toHaveLength(1);
			expect(bindings[0].textKey).toBe('f');
			expect(bindings[0].meta).toBe(true);

			vi.unstubAllGlobals();
		});

		it('returns known composed characters for macOS', async () => {
			vi.stubGlobal('process', { ...process, platform: 'darwin' });

			vi.resetModules();
			const { modKeyBindings } = await import('./index.js');

			expect(modKeyBindings('m')[0].textKey).toBe('\u00B5'); // µ
			expect(modKeyBindings('p')[0].textKey).toBe('\u03C0'); // π

			vi.unstubAllGlobals();
		});

		it('falls back to letter for unknown macOS opt chars', async () => {
			vi.stubGlobal('process', { ...process, platform: 'darwin' });

			vi.resetModules();
			const { modKeyBindings } = await import('./index.js');

			const bindings = modKeyBindings('z');

			expect(bindings[0].textKey).toBe('z');
			expect(bindings[0].meta).toBe(false);

			vi.unstubAllGlobals();
		});
	});
});
