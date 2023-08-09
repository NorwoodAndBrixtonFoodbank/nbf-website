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
