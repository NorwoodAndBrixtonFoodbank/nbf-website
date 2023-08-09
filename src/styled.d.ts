import "styled-components";

declare module "styled-components" {
    export type StandardPaletteList = {
        background: string[];
        foreground: string[];
        largeForeground: string[];
    };

    export type StandardPalette = {
        background: string;
        foreground: string;
        largeForeground: string;
    };

    export type RainbowPalette = {
        lightRed: StandardPalette;
        darkRed: StandardPalette;
        lightOrange: StandardPalette;
        darkOrange: StandardPalette;
        lightYellow: StandardPalette;
        darkYellow: StandardPalette;
        lightGreen: StandardPalette;
        darkGreen: StandardPalette;
        lightBlue: StandardPalette;
        darkBlue: StandardPalette;
        lightPurple: StandardPalette;
        darkPurple: StandardPalette;
        lightGrey: StandardPalette;
        darkGrey: StandardPalette;
        lightBrown: StandardPalette;
        darkBrown: StandardPalette;
    };

    /**
     * The array represents a gradient of color
     * * In light mode: 0 represents the lightest and larger index represents darker color
     * * In dark mode: reversed
     *
     * General usage:
     *
     * _main_
     * * main[2] and main[0] for page background and boxes
     * * main[1] for highlights (replace low opacity), main[3] for navbar
     *
     * _primary_
     * * primary[2] for basically most green
     * * primary[1] and primary[3] for some buttons with more contrasting colors
     * * primary[0] and primary[4] for highlights (replace low opacity)
     * */
    export interface DefaultTheme {
        light: boolean;
        main: StandardPaletteList & { lighterForeground: string[]; border: string };
        primary: StandardPaletteList;
        accent: StandardPalette;
        error: string;
        shadow: string;
        rainbow: RainbowPalette;
    }
}
