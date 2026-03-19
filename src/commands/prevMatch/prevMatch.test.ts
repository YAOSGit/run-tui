import { createMockDeps } from '../../test-utils/mockDeps.js';
import { prevMatchCommand } from './index.js';

describe('prevMatchCommand', () => {
	it('should have correct ID', () => {
		expect(prevMatchCommand.id).toBe('PREV_MATCH');
	});

	it('should be enabled when a search query exists and search is closed', () => {
		const providers = createMockDeps({
			showSearch: false,
			searchQuery: 'test',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(true);
	});

	it('should be disabled when search is open', () => {
		const providers = createMockDeps({
			showSearch: true,
			searchQuery: 'test',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should be disabled when there is no query', () => {
		const providers = createMockDeps({
			showSearch: false,
			searchQuery: '',
		});
		expect(prevMatchCommand.isEnabled?.(providers)).toBe(false);
	});
});
