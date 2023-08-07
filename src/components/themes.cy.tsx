"use client";

import React from "react";
import styled, {
    DefaultTheme,
    rainbowPalette,
    standardPaletteList,
    standardPalette,
} from "styled-components";
import StyleManager, { lightTheme, darkTheme } from "@/app/themes";
import { Result } from "axe-core";

const checkColorContrast = (): void => {
    const terminalLog = (violations: Result[]): void => {
        cy.task(
            "table",
            violations.map(({ id, impact, description, nodes }) => ({
                id,
                impact,
                description,
                length: nodes.length,
            }))
        );
    };

    cy.injectAxe();
    cy.checkA11y(undefined, { runOnly: { type: "tag", values: ["wcag2aa"] } }, terminalLog);
};
const ForegroundWithBackground: React.FC<standardPalette> = (props) => {
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
    const generalThemeCategories: ("main" | "primary")[] = ["main", "primary"];
    const rainbowThemeCategories = Object.keys(props.theme.rainbow) as (keyof rainbowPalette)[];

    const lighterMainTheme: standardPaletteList[] = [
        {
            ...props.theme.main,
            foreground: props.theme.main.lighterForeground,
            largeForeground: props.theme.main.lighterForeground,
        },
    ];
    const generalThemes: standardPaletteList[] = generalThemeCategories.map(
        (themeType) => props.theme[themeType]
    );
    const accentTheme: standardPaletteList = {
        background: [props.theme.accent.background],
        foreground: [props.theme.accent.foreground],
        largeForeground: [props.theme.accent.largeForeground],
    };
    const rainbowThemes: standardPaletteList[] = rainbowThemeCategories.map((colorType) => {
        return {
            background: [props.theme.rainbow[colorType].background],
            foreground: [props.theme.rainbow[colorType].foreground],
            largeForeground: [props.theme.rainbow[colorType].largeForeground],
        };
    });

    const allThemes: standardPaletteList[] = [accentTheme].concat(
        lighterMainTheme,
        generalThemes,
        rainbowThemes
    );

    return (
        <StyleManager>
            <>
                {allThemes.map((theme: standardPaletteList) =>
                    theme.background.map((background: string, index: number) => (
                        <ForegroundWithBackground
                            key={index}
                            background={background}
                            foreground={theme.foreground[index]}
                            largeForeground={theme.largeForeground[index]}
                        />
                    ))
                )}
            </>
        </StyleManager>
    );
};

describe("Light and dark mode buttons work", () => {
    it("Light mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={lightTheme} />);
        checkColorContrast();
    });

    it("Dark mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={darkTheme} />);
        checkColorContrast();
    });
});
