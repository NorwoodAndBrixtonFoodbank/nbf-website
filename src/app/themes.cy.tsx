"use client";

import React from "react";
import styled, { DefaultTheme, StandardPaletteList, StandardPalette } from "styled-components";
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
                    key={index}
                    background={theme.background}
                    foreground={theme.foreground}
                    largeForeground={theme.largeForeground}
                />
            ))}
            {gradientThemes.map((theme) =>
                theme.background.map((background, index) => (
                    <ForegroundWithBackground
                        key={index + singleColourThemes.length}
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
