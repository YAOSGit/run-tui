/**
 * The modifier key name for the current platform.
 * macOS: "opt" | other: "alt"
 */
export const MOD_KEY = process.platform === 'darwin' ? 'opt' : 'alt';

/**
 * Returns a display string like "opt + f" (macOS) or "alt + f" (other).
 * Uses non-breaking spaces.
 */
export const modKey = (key: string): string => `${MOD_KEY}\xA0+\xA0${key}`;

/**
 * The composed Unicode character sent by opt/alt + letter on macOS.
 * On non-macOS terminals, alt+letter sends meta=true instead.
 * Map of letter → macOS composed character.
 */
const DARWIN_OPT_CHARS: Record<string, string> = {
    f: 'ƒ',
    m: 'µ',
    p: 'π',
};

/**
 * Returns the key bindings for an opt/alt + letter command.
 * On macOS, opt+letter produces a composed Unicode character (no meta flag).
 * On other platforms, alt+letter is reported as meta=true + the plain letter.
 */
export const modKeyBindings = (
    letter: string,
): Array<{ textKey: string; meta: boolean }> => {
    if (process.platform === 'darwin') {
        const composed = DARWIN_OPT_CHARS[letter] ?? letter;
        return [{ textKey: composed, meta: false }];
    }
    return [{ textKey: letter, meta: true }];
};
