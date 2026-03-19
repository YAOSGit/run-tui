import { HelpMenu as ToolkitHelpMenu } from '@yaos-git/toolkit/tui/components';
import { COMMANDS } from '../../providers/CommandsProvider/index.js';
import { SECTION_COLORS } from '../../providers/CommandsProvider/CommandsProvider.consts.js';
import type { RunTuiDeps } from '../../providers/CommandsProvider/CommandsProvider.types.js';
import { useUIState } from '../../providers/UIStateProvider/index.js';

/**
 * Deduplicate commands by id (project commands shadow toolkit defaults).
 */
const deduped = (() => {
	const seenIds = new Set<string>();
	return COMMANDS.filter((cmd) => {
		if (seenIds.has(cmd.id)) return false;
		seenIds.add(cmd.id);
		return true;
	});
})();

export function HelpMenu({ width: _width }: { width?: number }) {
	const { closeHelp } = useUIState();

	return (
		<ToolkitHelpMenu<RunTuiDeps>
			commands={deduped}
			sectionColors={SECTION_COLORS}
			title="YAOSGit run - Keyboard Shortcuts"
			onClose={closeHelp}
		/>
	);
}
