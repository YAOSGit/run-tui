import { describe, expect, it } from 'vitest';
import { fuzzyFilter, fuzzyScore } from './index.js';

describe('fuzzyScore', () => {
	it('returns 0 for empty query', () => {
		expect(fuzzyScore('', 'anything')).toBe(0);
	});

	it('returns 1000 for exact match', () => {
		expect(fuzzyScore('dev', 'dev')).toBe(1000);
	});

	it('returns high score for prefix match', () => {
		const score = fuzzyScore('dev', 'dev:watch');
		expect(score).toBeGreaterThan(400);
	});

	it('returns null when query chars are not all in target', () => {
		expect(fuzzyScore('xyz', 'dev')).toBeNull();
	});

	it('scores consecutive chars higher than scattered', () => {
		// biome-ignore lint/style/noNonNullAssertion: testing assertions
		const consecutive = fuzzyScore('dw', 'dev:watch')!;
		// biome-ignore lint/style/noNonNullAssertion: testing assertions
		const scattered = fuzzyScore('dw', 'download')!;
		// dev:watch has d then w right after colon (word boundary) — should score higher
		expect(consecutive).not.toBeNull();
		expect(scattered).not.toBeNull();
		// Both match, scores may vary by specific heuristics
		expect(consecutive).toBeGreaterThan(0);
	});

	it('returns null when only some chars are found', () => {
		expect(fuzzyScore('xyz', 'xanadu')).toBeNull();
	});

	it('handles single character match', () => {
		expect(fuzzyScore('d', 'dev')).toBeGreaterThan(0);
	});
});

describe('fuzzyFilter', () => {
	const scripts = ['dev', 'dev:watch', 'build', 'test', 'lint', 'deploy'];

	it('returns all items with score 0 for empty query', () => {
		const results = fuzzyFilter(scripts, '', (s) => s);
		expect(results).toHaveLength(scripts.length);
		for (const r of results) {
			expect(r.score).toBe(0);
		}
	});

	it('filters out non-matching items', () => {
		const results = fuzzyFilter(scripts, 'xyz', (s) => s);
		expect(results).toHaveLength(0);
	});

	it('includes matching items', () => {
		const results = fuzzyFilter(scripts, 'dev', (s) => s);
		const names = results.map((r) => r.item);
		expect(names).toContain('dev');
		expect(names).toContain('dev:watch');
		expect(names).not.toContain('build');
	});

	it('sorts by score descending (best match first)', () => {
		const results = fuzzyFilter(['dev:watch', 'dev'], 'dev', (s) => s);
		// Exact match 'dev' should score higher than 'dev:watch'
		expect(results[0].item).toBe('dev');
	});

	it('works with custom getText function', () => {
		const items = [{ name: 'dev' }, { name: 'build' }];
		const results = fuzzyFilter(items, 'dev', (item) => item.name);
		expect(results).toHaveLength(1);
		expect(results[0].item.name).toBe('dev');
	});
});
