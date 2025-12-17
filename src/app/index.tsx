import { useApp, useStdout } from 'ink';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { PackageManager } from '../types/PackageManager/index.js';
import { AppContent } from './app.js';
import { AppProviders } from './providers.js';

interface AppProps {
	tasks: string[];
	packageManager: PackageManager;
	availableScripts: string[];
	keepAlive: boolean;
	height: number;
}

const App: React.FC<AppProps> = ({
	tasks: initialTasks,
	packageManager,
	availableScripts,
	keepAlive,
	height,
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
		<AppProviders
			initialTasks={initialTasks}
			packageManager={packageManager}
			keepAlive={keepAlive}
			viewHeight={height}
			initialShowScriptSelector={initialShowScriptSelector}
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
	);
};

export default App;
