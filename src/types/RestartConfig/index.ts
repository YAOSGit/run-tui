export interface RestartConfig {
	enabled: boolean;
	delayMs: number;
	maxAttempts: number;
	exitCodes?: number[];
}

export const DEFAULT_RESTART_CONFIG: RestartConfig = {
	enabled: false,
	delayMs: 2000,
	maxAttempts: 3,
};
