import { createMockDeps } from '../../test-utils/mockDeps.js';
import {
	scrollDownCommand,
	scrollToBottomCommand,
	scrollUpCommand,
} from './index.js';

describe('scrollUpCommand', () => {
	it('has correct id', () => {
		expect(scrollUpCommand.id).toBe('SCROLL_UP');
	});

	it('has correct keys', () => {
		expect(scrollUpCommand.keys).toEqual([{ specialKey: 'up' }]);
	});

	it('has correct displayKey', () => {
		expect(scrollUpCommand.displayKey).toBe('↑ / ↓');
	});

	it('has correct displayText', () => {
		expect(scrollUpCommand.displayText).toBe('scroll');
	});

	describe('isEnabled', () => {
		it('returns true when can scroll up', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when content fits in view', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 10,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at top', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 30, // At max (50 - 20)
			});
			expect(scrollUpCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollUp', () => {
			const providers = createMockDeps();
			scrollUpCommand.execute(providers);
			expect(providers.view.scrollUp).toHaveBeenCalledOnce();
		});
	});
});

describe('scrollDownCommand', () => {
	it('has correct id', () => {
		expect(scrollDownCommand.id).toBe('SCROLL_DOWN');
	});

	it('has correct keys', () => {
		expect(scrollDownCommand.keys).toEqual([{ specialKey: 'down' }]);
	});

	it('has correct displayKey', () => {
		expect(scrollDownCommand.displayKey).toBe('↑ / ↓');
	});

	it('has correct displayText', () => {
		expect(scrollDownCommand.displayText).toBe('scroll');
	});

	describe('isEnabled', () => {
		it('returns true when can scroll down', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 10,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when content fits in view', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 10,
				viewHeight: 20,
				scrollOffset: 0,
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at bottom', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				totalLogs: 50,
				viewHeight: 20,
				scrollOffset: 0, // At bottom
			});
			expect(scrollDownCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollDown', () => {
			const providers = createMockDeps();
			scrollDownCommand.execute(providers);
			expect(providers.view.scrollDown).toHaveBeenCalledOnce();
		});
	});
});

describe('scrollToBottomCommand', () => {
	it('has correct id', () => {
		expect(scrollToBottomCommand.id).toBe('SCROLL_TO_BOTTOM');
	});

	it('has correct keys', () => {
		expect(scrollToBottomCommand.keys).toEqual([{ textKey: 'b' }]);
	});

	it('has correct displayText', () => {
		expect(scrollToBottomCommand.displayText).toBe('bottom');
	});

	describe('isEnabled', () => {
		it('returns true when not at bottom (autoScroll false)', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(true);
		});

		it('returns false when script selector is shown', () => {
			const providers = createMockDeps({
				showScriptSelector: true,
				tasks: ['task1'],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when no tasks exist', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: [],
				autoScroll: false,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});

		it('returns false when already at bottom (autoScroll true)', () => {
			const providers = createMockDeps({
				showScriptSelector: false,
				tasks: ['task1'],
				autoScroll: true,
			});
			expect(scrollToBottomCommand.isEnabled(providers)).toBe(false);
		});
	});

	describe('execute', () => {
		it('calls scrollToBottom', () => {
			const providers = createMockDeps();
			scrollToBottomCommand.execute(providers);
			expect(providers.view.scrollToBottom).toHaveBeenCalledOnce();
		});
	});
});
