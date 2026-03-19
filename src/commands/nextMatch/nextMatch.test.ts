import { createMockDeps } from '../../test-utils/mockDeps.js';
import { nextMatchCommand } from './index.js';

describe('nextMatchCommand', () => {
	it('should have correct ID', () => {
		expect(nextMatchCommand.id).toBe('NEXT_MATCH');
	});

	it('should be enabled when a search query exists and search is closed', () => {
		const providers = createMockDeps({
			showSearch: false,
			searchQuery: 'test',
		});
		expect(nextMatchCommand.isEnabled?.(providers)).toBe(true);
	});

	it('should be disabled when search is open', () => {
		const providers = createMockDeps({
			showSearch: true,
			searchQuery: 'test',
		});
		expect(nextMatchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should be disabled when there is no query', () => {
		const providers = createMockDeps({
			showSearch: false,
			searchQuery: '',
		});
		expect(nextMatchCommand.isEnabled?.(providers)).toBe(false);
	});
});
