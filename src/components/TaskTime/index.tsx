import { Text } from 'ink';
import { useEffect, useState } from 'react';
import { formatDuration } from '../../utils/formatTime/index.js';

export interface TaskTimeProps {
	startedAt: number | null;
	endedAt: number | null;
}

export function TaskTime({ startedAt, endedAt }: TaskTimeProps) {
	const [now, setNow] = useState<number>(Date.now());

	useEffect(() => {
		if (startedAt === null || endedAt !== null) {
			return; // Don't tick if not started or already finished
		}

		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => clearInterval(interval);
	}, [startedAt, endedAt]);

	if (startedAt === null) {
		return null;
	}

	const elapsedMs = (endedAt ?? now) - startedAt;

	return <Text dimColor> ({formatDuration(elapsedMs)})</Text>;
}
