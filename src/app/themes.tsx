"use client";

import GlobalStyle from "@/app/global_styles";
import isPropValid from "@emotion/is-prop-valid";
import { useServerInsertedHTML } from "next/navigation";
import React, { createContext, useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

type CustomTheme = {
    foregroundColor: string;
    backgroundColor: string;
    primaryForegroundColor: string;
    primaryBackgroundColor: string;
    secondaryForegroundColor: string;
    secondaryBackgroundColor: string;
    accentBackgroundColor: string;
    accentForegroundColor: string;
    surfaceForegroundColor: string;
    surfaceBackgroundColor: string;
    errorColor: string;
};

const lightTheme: CustomTheme = {
    foregroundColor: "#000000",
    backgroundColor: "#eeeeee",
    primaryForegroundColor: "#000000",
    primaryBackgroundColor: "#63a036",
    secondaryForegroundColor: "#ffffff",
    secondaryBackgroundColor: "#066940",
    accentBackgroundColor: "#609fd3",
    accentForegroundColor: "#000000",
    surfaceForegroundColor: "#000000",
    surfaceBackgroundColor: "#ffffff",
    errorColor: "#ff624e",
};

const darkTheme: CustomTheme = {
    foregroundColor: "#ffffff",
    backgroundColor: "#1a1a1a",
    primaryForegroundColor: "#ffffff",
    primaryBackgroundColor: "#066940",
    secondaryForegroundColor: "#000000",
    secondaryBackgroundColor: "#63a036",
    accentBackgroundColor: "#1b629c",
    accentForegroundColor: "#ffffff",
    surfaceForegroundColor: "#ffffff",
    surfaceBackgroundColor: "#161414",
    errorColor: "#ff624e",
};

interface Props {
    children: React.ReactElement;
    theme?: CustomTheme;
}

export const ThemeUpdateContext = createContext((dark: boolean): void => {
    throw new Error(
        `attempted to set theme outside of a ThemeUpdateContext.Provider: Dark: ${dark}`
    );
});

/*
 * Makes a styled-components global registry to get server-side inserted CSS
 * Adapted from https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
const StyleManager: React.FC<Props> = ({ children, theme = lightTheme }) => {
    const [serverStyleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = serverStyleSheet.getStyleElement();
        serverStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    const [chosenTheme, setChosenTheme] = useState(theme);

    const handleThemeChange = (dark: boolean): void => {
        setChosenTheme(dark ? darkTheme : lightTheme);
    };

    const themedChildren =
        typeof window !== "undefined" ? (
            children
        ) : (
            <StyleSheetManager sheet={serverStyleSheet.instance} shouldForwardProp={isPropValid}>
                {children}
            </StyleSheetManager>
        );

    return (
        <ThemeUpdateContext.Provider value={handleThemeChange}>
            <ThemeProvider theme={chosenTheme}>
                <GlobalStyle />
                {themedChildren}
            </ThemeProvider>
        </ThemeUpdateContext.Provider>
    );
};

export default StyleManager;
