import { StatusMessage } from '@inkjs/ui';
import { CommandFooter } from '@yaos-git/toolkit/tui/components';
import { Box, Text } from 'ink';
import { theme } from '../../theme.js';
import { SCROLL_AUTOSCROLL_COLOR, SCROLL_PAUSED_COLOR, STATUS_VARIANTS } from './Footer.consts.js';
import type { FooterProps } from './Footer.types.js';

export function Footer({
	commands,
	activeTask,
	status,
	logFilter,
	scrollInfo,
	width,
	confirmation,
}: FooterProps) {
	const commandObjects = commands.map((cmd) => ({
		id: `${cmd.displayKey}-${cmd.displayText}`,
		keys: [],
		displayKey: String(cmd.displayKey),
		displayText: cmd.displayText,
		footer: cmd.priority ? ('priority' as const) : ('optional' as const),
		footerOrder: cmd.footerOrder,
		isEnabled: () => true,
		execute: () => {},
	}));

	const footerDeps = {
		ui: {
			activeOverlay: 'none' as const,
			setActiveOverlay: () => {},
			confirmation: confirmation ? { ...confirmation, onConfirm: () => {} } : null,
			requestConfirmation: () => {},
			clearConfirmation: () => {},
			cycleFocus: () => {},
		},
		onQuit: () => {},
	};

	const scrollIndicator = scrollInfo && scrollInfo.totalLogs > 0 && (
		<Text dimColor>
			{scrollInfo.startLine}-{scrollInfo.endLine}/{scrollInfo.totalLogs}
			{scrollInfo.autoScroll ? (
				<Text color={SCROLL_AUTOSCROLL_COLOR}> ▶</Text>
			) : (
				<Text color={SCROLL_PAUSED_COLOR}> ⏸</Text>
			)}
		</Text>
	);

	if (confirmation) {
		return (
			<CommandFooter
				brand="run"
				commands={commandObjects}
				deps={footerDeps}
				theme={theme}
				width={width}
			/>
		);
	}

	return (
		<Box marginTop={1} flexDirection="column" gap={1}>
			{activeTask && status && (
				<Box justifyContent="space-between">
					<StatusMessage variant={STATUS_VARIANTS[status]}>
						<Text bold>{activeTask}</Text>
						<Text dimColor> - {status.toUpperCase()}</Text>
						<Text dimColor> [{logFilter ?? 'all'}]</Text>
					</StatusMessage>
					{scrollIndicator}
				</Box>
			)}
			<CommandFooter
				brand="run"
				commands={commandObjects}
				deps={footerDeps}
				theme={theme}
				width={width}
			/>
		</Box>
	);
}
