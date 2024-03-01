"use client";

import StyleManager, { darkTheme, lightTheme } from "@/app/themes";
import React from "react";
import styled, { DefaultTheme, StandardPalette, StandardPaletteList } from "styled-components";

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
    const mainLighterTest = {
        background: props.theme.main.background,
        foreground: props.theme.main.lighterForeground,
        largeForeground: props.theme.main.lighterForeground,
    };
    const errorTests = props.theme.main.background.map((background) => ({
        background,
        foreground: props.theme.error,
        largeForeground: props.theme.error,
    }));

    const gradientThemes: StandardPaletteList[] = [
        props.theme.main,
        props.theme.primary,
        mainLighterTest,
    ];
    const singleColourThemes: StandardPalette[] = [
        props.theme.accent,
        ...Object.values(props.theme.rainbow),
        ...errorTests,
    ];

    return (
        <StyleManager>
            {singleColourThemes.map((theme, index) => (
                <ForegroundWithBackground
                    key={index} // eslint-disable-line react/no-array-index-key
                    background={theme.background}
                    foreground={theme.foreground}
                    largeForeground={theme.largeForeground}
                />
            ))}
            {gradientThemes.map((theme) =>
                theme.background.map((background, index) => (
                    <ForegroundWithBackground
                        key={index + singleColourThemes.length} // eslint-disable-line react/no-array-index-key
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
    const checkColourContrastOnly = { runOnly: { type: "tag", values: ["wcag2aa"] } };

    it("Light mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={lightTheme} />);
        cy.checkAccessibility(checkColourContrastOnly);
    });

    it("Dark mode theme colors are all accessible", () => {
        cy.mount(<GenerateForegroundWithBackground theme={darkTheme} />);
        cy.checkAccessibility(checkColourContrastOnly);
    });
});
