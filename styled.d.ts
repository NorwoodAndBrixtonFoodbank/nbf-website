import "styled-components";

declare module "styled-components" {
    export type standardPaletteList = {
        background: string[];
        foreground: string[];
        largeForeground: string[];
    };

    export type standardPalette = {
        background: string;
        foreground: string;
        largeForeground: string;
    };

    export type rainbowPalette = {
        lightRed: standardPalette;
        darkRed: standardPalette;
        lightOrange: standardPalette;
        darkOrange: standardPalette;
        lightYellow: standardPalette;
        darkYellow: standardPalette;
        lightGreen: standardPalette;
        darkGreen: standardPalette;
        lightBlue: standardPalette;
        darkBlue: standardPalette;
        lightPurple: standardPalette;
        darkPurple: standardPalette;
        lightGrey: standardPalette;
        darkGrey: standardPalette;
        lightBrown: standardPalette;
        darkBrown: standardPalette;
    };

    export interface DefaultTheme {
        light: boolean;
        main: standardPaletteList & { lighterForeground: string; border: string };
        primary: standardPaletteList;
        accent: standardPalette;
        error: string;
        shadow: string;
        rainbow: rainbowPalette;
    }
}
