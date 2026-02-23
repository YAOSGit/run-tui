import { render } from 'ink-testing-library';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ErrorBoundary } from './index.js';

// A component that always throws during render
const ThrowingComponent = ({ message }: { message: string }) => {
	throw new Error(message);
};

// A well-behaved component
const NormalComponent = () => {
	return React.createElement('ink-text', {}, 'All good');
};

describe('ErrorBoundary', () => {
	it('renders children when there is no error', () => {
		// We can't easily test this with ink-testing-library and a throwing component
		// without suppressing console.error, but we can test the happy path
		const { lastFrame } = render(
			<ErrorBoundary>
				<NormalComponent />
			</ErrorBoundary>,
		);
		expect(lastFrame()).toContain('All good');
	});

	it('shows default error UI when a child throws', () => {
		// Suppress React's console.error for this test
		const originalConsoleError = console.error;
		console.error = () => {};
		try {
			const { lastFrame } = render(
				<ErrorBoundary>
					<ThrowingComponent message="render failed" />
				</ErrorBoundary>,
			);
			expect(lastFrame()).toContain('Something went wrong');
			expect(lastFrame()).toContain('render failed');
			expect(lastFrame()).toContain("Press 'q' to quit");
		} finally {
			console.error = originalConsoleError;
		}
	});

	it('renders custom fallback when provided', () => {
		const originalConsoleError = console.error;
		console.error = () => {};
		try {
			const fallback = React.createElement('ink-text', {}, 'Custom error UI');
			const { lastFrame } = render(
				<ErrorBoundary fallback={fallback}>
					<ThrowingComponent message="oops" />
				</ErrorBoundary>,
			);
			expect(lastFrame()).toContain('Custom error UI');
			expect(lastFrame()).not.toContain('Something went wrong');
		} finally {
			console.error = originalConsoleError;
		}
	});
});
