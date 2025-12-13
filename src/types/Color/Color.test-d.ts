import { assertType, describe, expectTypeOf, it } from 'vitest';
import { COLOR, type Color } from './index.js';

describe('Color type tests', () => {
	it('Color is a union of color string literals', () => {
		expectTypeOf<Color>().toEqualTypeOf<
			| 'black'
			| 'red'
			| 'green'
			| 'yellow'
			| 'blue'
			| 'magenta'
			| 'cyan'
			| 'white'
			| 'gray'
			| 'redBright'
			| 'greenBright'
			| 'yellowBright'
			| 'blueBright'
			| 'magentaBright'
			| 'cyanBright'
			| 'whiteBright'
		>();
	});

	it('COLOR values satisfy Color type', () => {
		assertType<Color>(COLOR.BLACK);
		assertType<Color>(COLOR.RED);
		assertType<Color>(COLOR.GREEN);
		assertType<Color>(COLOR.YELLOW);
		assertType<Color>(COLOR.BLUE);
		assertType<Color>(COLOR.MAGENTA);
		assertType<Color>(COLOR.CYAN);
		assertType<Color>(COLOR.WHITE);
		assertType<Color>(COLOR.GRAY);
		assertType<Color>(COLOR.RED_BRIGHT);
		assertType<Color>(COLOR.GREEN_BRIGHT);
		assertType<Color>(COLOR.YELLOW_BRIGHT);
		assertType<Color>(COLOR.BLUE_BRIGHT);
		assertType<Color>(COLOR.MAGENTA_BRIGHT);
		assertType<Color>(COLOR.CYAN_BRIGHT);
		assertType<Color>(COLOR.WHITE_BRIGHT);
	});

	it('rejects invalid color values', () => {
		// @ts-expect-error - 'orange' is not a valid Color
		assertType<Color>('orange');
	});
});
