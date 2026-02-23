import type { Command } from '../../types/Command/index.js';
import {
	copyToClipboard,
	formatLogsAsText,
	saveLogsToFile,
} from '../../utils/exportLogs/index.js';

const isEnabled = (p: Parameters<Command['isEnabled']>[0]) =>
	!p.ui.showScriptSelector && p.tasks.tasks.length > 0;

export const exportCurrentLogsCommand: Command = {
	id: 'EXPORT_CURRENT_LOGS',
	keys: [{ textKey: 'e', ctrl: true, shift: false }],
	displayKey: 'ctrl + e',
	displayText: 'save log',
	footer: 'optional',
	footerOrder: 80,
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Export logs',
	isEnabled,
	execute: (p) => {
		const task = p.view.activeTask;
		if (!task) return;
		const logs = p.logs.getLogsForTask(task, null);
		const text = formatLogsAsText(logs);
		saveLogsToFile(task, text).catch(() => { });
	},
};

export const exportAllLogsCommand: Command = {
	id: 'EXPORT_ALL_LOGS',
	keys: [{ textKey: 'E', ctrl: false, shift: true }],
	displayKey: 'shift + e',
	displayText: 'save all',
	footer: 'hidden',
	helpSection: 'Mass Actions (Shift)',
	helpLabel: 'Export all logs',
	isEnabled,
	execute: (p) => {
		for (const task of p.tasks.tasks) {
			const logs = p.logs.getLogsForTask(task, null);
			const text = formatLogsAsText(logs);
			saveLogsToFile(task, text).catch(() => { });
		}
	},
};

export const copyCurrentLogsCommand: Command = {
	id: 'COPY_CURRENT_LOGS',
	keys: [{ textKey: 'y', ctrl: true }],
	displayKey: 'ctrl + y',
	displayText: 'copy log',
	footer: 'optional',
	footerOrder: 90,
	helpSection: 'Logs (Ctrl)',
	helpLabel: 'Copy logs',
	isEnabled,
	execute: (p) => {
		const task = p.view.activeTask;
		if (!task) return;
		const logs = p.logs.getLogsForTask(task, null);
		const text = formatLogsAsText(logs);
		copyToClipboard(text).catch(() => { });
	},
};
