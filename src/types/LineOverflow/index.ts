export const LINE_OVERFLOW = {
	WRAP: 'wrap',
	TRUNCATE: 'truncate',
	TRUNCATE_END: 'truncate-end',
} as const;

export type LineOverflow = (typeof LINE_OVERFLOW)[keyof typeof LINE_OVERFLOW];
