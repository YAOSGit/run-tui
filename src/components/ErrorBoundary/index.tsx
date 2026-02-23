import { Box, Text } from 'ink';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<Box flexDirection="column" padding={1}>
						<Text bold color="red">
							Something went wrong
						</Text>
						<Text dimColor>{this.state.error?.message}</Text>
						<Text dimColor>Press 'q' to quit</Text>
					</Box>
				)
			);
		}
		return this.props.children;
	}
}
