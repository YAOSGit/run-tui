import { useApp, useStdout } from 'ink';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary/index.js';
import type { PackageManager } from '../types/PackageManager/index.js';
import type { RestartConfig } from '../types/RestartConfig/index.js';
import { AppContent } from './app.js';
import { AppProviders } from './providers.js';

interface AppProps {
	tasks: string[];
	packageManager: PackageManager;
	availableScripts: string[];
	keepAlive: boolean;
	height?: number;
	restartConfig: RestartConfig;
	scriptArgs: string[];
}

const App: React.FC<AppProps> = ({
	tasks: initialTasks,
	packageManager,
	availableScripts,
	keepAlive,
	height,
	restartConfig,
	scriptArgs,
}) => {
	const { stdout } = useStdout();
	const width = stdout?.columns ?? 80;
	const { exit } = useApp();

	const handleQuit = useCallback(() => {
		exit();
		setTimeout(() => process.exit(0), 100);
	}, [exit]);

	const initialShowScriptSelector = useMemo(
		() => initialTasks.length === 0 && keepAlive,
		[initialTasks.length, keepAlive],
	);

	return (
		<ErrorBoundary>
			<AppProviders
				initialTasks={initialTasks}
				packageManager={packageManager}
				keepAlive={keepAlive}
				viewHeight={height}
				initialShowScriptSelector={initialShowScriptSelector}
				restartConfig={restartConfig}
				scriptArgs={scriptArgs}
				onQuit={handleQuit}
			>
				<AppContent
					availableScripts={availableScripts}
					keepAlive={keepAlive}
					height={height}
					width={width}
					onQuit={handleQuit}
				/>
			</AppProviders>
		</ErrorBoundary>
	);
};

export default App;
