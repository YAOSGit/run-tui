export interface ScriptSelectorProps {
	availableScripts: string[];
	runningScripts: string[];
	onSelect: (script: string) => void;
	onCancel: () => void;
	height: number;
}
