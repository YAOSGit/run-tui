import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './index.js';

describe('SearchBar', () => {
	it('renders empty search input correctly', () => {
		const { lastFrame } = render(
			<SearchBar
				query=""
				onQueryChange={vi.fn()}
				matchesCount={0}
				currentMatchIndex={null}
				onClose={vi.fn()}
				onNextMatch={vi.fn()}
				onPrevMatch={vi.fn()}
			/>,
		);

		const frame = lastFrame();
		expect(frame).toContain('/');
		expect(frame).toContain('_');
		expect(frame).not.toContain('[0/0]');
	});

	it('renders typed query correctly', () => {
		const { lastFrame } = render(
			<SearchBar
				query="error pattern"
				onQueryChange={vi.fn()}
				matchesCount={0}
				currentMatchIndex={null}
				onClose={vi.fn()}
				onNextMatch={vi.fn()}
				onPrevMatch={vi.fn()}
			/>,
		);

		const frame = lastFrame();
		expect(frame).toContain('error pattern');
		// When query is typed but zero matches, show [0/0]
		expect(frame).toContain('[0/0]');
	});

	it('renders match counts when available', () => {
		const { lastFrame } = render(
			<SearchBar
				query="error"
				onQueryChange={vi.fn()}
				matchesCount={5}
				currentMatchIndex={1}
				onClose={vi.fn()}
				onNextMatch={vi.fn()}
				onPrevMatch={vi.fn()}
			/>,
		);

		const frame = lastFrame();
		// currentMatchIndex is 0-based, so 1 -> 2
		expect(frame).toContain('[2/5]');
	});
});
