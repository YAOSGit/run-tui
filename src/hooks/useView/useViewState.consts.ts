import type { LogType } from '../../types/LogType/index.js';

// Log filter cycle: null -> stdout -> stderr -> null
export const LOG_FILTERS: (LogType | null)[] = [null, 'stdout', 'stderr'];
