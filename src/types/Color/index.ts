export const COLOR = {
	BLACK: 'black',
	RED: 'red',
	GREEN: 'green',
	YELLOW: 'yellow',
	BLUE: 'blue',
	MAGENTA: 'magenta',
	CYAN: 'cyan',
	WHITE: 'white',
	GRAY: 'gray',
	RED_BRIGHT: 'redBright',
	GREEN_BRIGHT: 'greenBright',
	YELLOW_BRIGHT: 'yellowBright',
	BLUE_BRIGHT: 'blueBright',
	MAGENTA_BRIGHT: 'magentaBright',
	CYAN_BRIGHT: 'cyanBright',
	WHITE_BRIGHT: 'whiteBright',
} as const;
export type Color = (typeof COLOR)[keyof typeof COLOR];
