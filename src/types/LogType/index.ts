export const LOG_TYPE = {
	STDOUT: 'stdout',
	STDERR: 'stderr',
} as const;
export type LogType = (typeof LOG_TYPE)[keyof typeof LOG_TYPE];
