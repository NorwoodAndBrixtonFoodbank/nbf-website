"use client";

import React from "react";
import styled, {
    DefaultTheme,
    RainbowPalette,
    StandardPaletteList,
    StandardPalette,
} from "styled-components";
import StyleManager, { lightTheme, darkTheme } from "@/app/themes";

const ForegroundWithBackground: React.FC<StandardPalette> = (props) => {
    const StyledH1 = styled.h1`
        color: ${props.largeForeground};
        background-color: ${props.background};
    `;

    const StyledParagraph = styled.p`
        color: ${props.foreground};
        background-color: ${props.background};
    `;

    return (
        <>
            <StyledH1>LargeForeground</StyledH1>
            <StyledParagraph>Foreground</StyledParagraph>
        </>
    );
};

const GenerateForegroundWithBackground: React.FC<{ theme: DefaultTheme }> = (props) => {
    const rainbowThemeCategories = Object.keys(props.theme.rainbow) as (keyof RainbowPalette)[];
    const mainLength = props.theme.main.background.length;

    const accentTheme: StandardPaletteList = {
        background: [props.theme.accent.background],
        foreground: [props.theme.accent.foreground],
        largeForeground: [props.theme.accent.largeForeground],
    };
    const lighterMainTheme: StandardPaletteList = {
        ...props.theme.main,
        foreground: props.theme.main.lighterForeground,
        largeForeground: props.theme.main.lighterForeground,
    };
    const errorMainTheme: StandardPaletteList = {
        ...props.theme.main,
        foreground: new Array(mainLength).fill(props.theme.error),
        largeForeground: new Array(mainLength).fill(props.theme.error),
    };
    const rainbowThemes: StandardPaletteList[] = rainbowThemeCategories.map((colorType) => {
        return {
            background: [props.theme.rainbow[colorType].background],
            foreground: [props.theme.rainbow[colorType].foreground],
            largeForeground: [props.theme.rainbow[colorType].largeForeground],
        };
    });
    const allThemes: StandardPaletteList[] = [
        accentTheme,
        lighterMainTheme,
        errorMainTheme,
        props.theme.main,
        props.theme.primary,
        ...rainbowThemes,
    ];

    return (
        <StyleManager>
            {allThemes.map((theme: StandardPaletteList) =>
                theme.background.map((background: string, index: number) => (
                    <ForegroundWithBackground
                        key={index}
                        background={background}
                        foreground={theme.foreground[index]}
                        largeForeground={theme.largeForeground[index]}
                    />
                ))
            )}
        </StyleManager>
    );
};

describe("Light and dark mode buttons work", () => {
    it("Light mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={lightTheme} />);
        cy.checkColorContrast();
    });

    it("Dark mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={darkTheme} />);
        cy.checkColorContrast();
    });
});
