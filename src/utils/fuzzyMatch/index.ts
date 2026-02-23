/**
 * Lightweight fuzzy matcher — no external dependencies.
 *
 * Scoring (higher = better match):
 *  - Exact match:      1000
 *  - Prefix match:      500
 *  - All chars found with consecutive bonus applied
 *
 * Returns null if not all query chars appear in the target.
 */
export function fuzzyScore(query: string, target: string): number | null {
	if (query === '') return 0;

	const q = query.toLowerCase();
	const t = target.toLowerCase();

	if (t === q) return 1000;
	if (t.startsWith(q)) return 500 + (q.length / t.length) * 100;

	let score = 0;
	let ti = 0;
	let lastMatch = -1;
	let consecutiveBonus = 0;

	for (let qi = 0; qi < q.length; qi++) {
		let found = false;

		while (ti < t.length) {
			if (t[ti] === q[qi]) {
				// Bonus for consecutive matches
				if (lastMatch === ti - 1) {
					consecutiveBonus += 5;
				} else {
					consecutiveBonus = 0;
				}

				// Bonus for matching at word boundaries (after - or :)
				const wordBoundaryBonus =
					ti === 0 ||
					t[ti - 1] === '-' ||
					t[ti - 1] === ':' ||
					t[ti - 1] === '_'
						? 10
						: 0;

				score += 10 + consecutiveBonus + wordBoundaryBonus;
				lastMatch = ti;
				ti++;
				found = true;
				break;
			}
			ti++;
		}

		if (!found) return null; // not all chars matched
	}

	// Prefer shorter matches (less "spread")
	score += Math.floor((q.length / target.length) * 20);

	return score;
}

export interface FuzzyResult<T> {
	item: T;
	score: number;
}

/**
 * Filter and rank an array of items using fuzzy matching.
 * Items that don't match are excluded.
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
