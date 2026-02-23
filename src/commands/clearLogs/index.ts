import { randomUUID } from 'node:crypto';
import type { Command } from '../../types/Command/index.js';
import { LOG_TYPE } from '../../types/LogType/index.js';

const isEnabled = (p: Parameters<Command['isEnabled']>[0]) =>
    !p.ui.showScriptSelector && p.tasks.tasks.length > 0;

export const clearCurrentLogsCommand: Command = {
    id: 'CLEAR_CURRENT_LOGS',
    keys: [{ textKey: 'l', ctrl: true, shift: false }],
    displayKey: 'ctrl + l',
    displayText: 'clear log',
    footer: 'optional',
    footerOrder: 100,
    helpSection: 'Logs (Ctrl)',
    helpLabel: 'Clear logs',
    isEnabled,
    execute: (p) => {
        const task = p.view.activeTask;
        if (!task) return;
        p.logs.clearLogsForTask(task);
        p.logs.addLog({
            id: randomUUID(),
            task,
            text: 'Logs cleared',
            type: LOG_TYPE.DIVIDER,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        });
        p.view.scrollToBottom();
    },
};

export const clearAllLogsCommand: Command = {
    id: 'CLEAR_ALL_LOGS',
    keys: [{ textKey: 'L', ctrl: false, shift: true }],
    displayKey: 'shift + l',
    displayText: 'clear all',
    footer: 'hidden',
    helpSection: 'Mass Actions (Shift)',
    helpLabel: 'Clear all logs',
    isEnabled,
    execute: (p) => {
        for (const task of p.tasks.tasks) {
            p.logs.clearLogsForTask(task);
            p.logs.addLog({
                id: randomUUID(),
                task,
                text: 'Logs cleared',
                type: LOG_TYPE.DIVIDER,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            });
        }
        p.view.scrollToBottom();
    },
};
