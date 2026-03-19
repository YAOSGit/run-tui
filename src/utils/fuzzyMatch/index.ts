/**
 * Re-exports the toolkit's fuzzy matching, with a thin wrapper to
 * preserve the project's API: empty-query returns 0, and fuzzyFilter
 * yields FuzzyResult<T>[] (item + score) instead of plain T[].
 */
import { fuzzyScore as toolkitFuzzyScore } from '@yaos-git/toolkit/cli/fuzzy';

/** Delegates to toolkit, but returns 0 for an empty query. */
export function fuzzyScore(query: string, target: string): number | null {
	if (query === '') return 0;
	return toolkitFuzzyScore(query, target);
}

export type FuzzyResult<T> = {
	item: T;
	score: number;
};

/**
 * Filter and rank an array of items using fuzzy matching.
 * Items that don't match are excluded.
 * Returns FuzzyResult<T>[] to preserve backward compatibility with callers.
 */
export function fuzzyFilter<T>(
	items: T[],
	query: string,
	getText: (item: T) => string,
): FuzzyResult<T>[] {
	if (query === '') {
		return items.map((item) => ({ item, score: 0 }));
	}

	const results: FuzzyResult<T>[] = [];

	for (const item of items) {
		const score = fuzzyScore(query, getText(item));
		if (score !== null) {
			results.push({ item, score });
		}
	}

	return results.sort((a, b) => b.score - a.score);
}
