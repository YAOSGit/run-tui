import type React from 'react';
import { CommandsProvider } from '../providers/CommandsProvider/index.js';
import { LogsProvider, useLogs } from '../providers/LogsProvider/index.js';
import { TasksProvider } from '../providers/TasksProvider/index.js';
import { UIStateProvider } from '../providers/UIStateProvider/index.js';
import { ViewProvider } from '../providers/ViewProvider/index.js';
import type { LogEntry } from '../types/LogEntry/index.js';
import type { PackageManager } from '../types/PackageManager/index.js';

const LogsConsumer: React.FC<{
	children: (addLog: (entry: LogEntry) => void) => React.ReactNode;
}> = ({ children }) => {
	const { addLog } = useLogs();
	return <>{children(addLog)}</>;
};

export interface AppProvidersProps {
	children: React.ReactNode;
	initialTasks: string[];
	packageManager: PackageManager;
	keepAlive: boolean;
	viewHeight: number;
	initialShowScriptSelector: boolean;
	onQuit: () => void;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
	children,
	initialTasks,
	packageManager,
	keepAlive,
	viewHeight,
	initialShowScriptSelector,
	onQuit,
}) => {
	return (
		<LogsProvider>
			<LogsConsumer>
				{(addLog) => (
					<TasksProvider
						initialTasks={initialTasks}
						packageManager={packageManager}
						onLogEntry={addLog}
					>
						<ViewProvider viewHeight={viewHeight}>
							<UIStateProvider
								initialShowScriptSelector={initialShowScriptSelector}
							>
								<CommandsProvider keepAlive={keepAlive} onQuit={onQuit}>
									{children}
								</CommandsProvider>
							</UIStateProvider>
						</ViewProvider>
					</TasksProvider>
				)}
			</LogsConsumer>
		</LogsProvider>
	);
};
