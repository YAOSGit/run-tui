import { createMockDeps } from '../../test-utils/mockDeps.js';
import { searchCommand } from './index.js';

describe('searchCommand', () => {
	it('should have correct ID', () => {
		expect(searchCommand.id).toBe('SEARCH');
	});

	it('should be bound to ctrl+f', () => {
		expect(searchCommand.keys[0]).toEqual({ textKey: 'f', ctrl: true });
	});

	it('should be enabled when tasks exist and search/selector are closed', () => {
		const providers = createMockDeps({
			showScriptSelector: false,
			tasks: ['task1'],
			showSearch: false,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(true);
	});

	it('should be disabled when selector is open', () => {
		const providers = createMockDeps({
			showScriptSelector: true,
			tasks: ['task1'],
			showSearch: false,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should be disabled when search is already open', () => {
		const providers = createMockDeps({
			showScriptSelector: false,
			tasks: ['task1'],
			showSearch: true,
		});
		expect(searchCommand.isEnabled?.(providers)).toBe(false);
	});

	it('should call openSearch on execute', () => {
		const providers = createMockDeps();
		searchCommand.execute(providers);
		expect(providers.view.openSearch).toHaveBeenCalled();
	});
});
