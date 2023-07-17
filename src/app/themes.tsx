"use client";

import GlobalStyle from "@/app/global_styles";
import isPropValid from "@emotion/is-prop-valid";
import { useServerInsertedHTML } from "next/navigation";
import React, { useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

export const lightTheme = {
    foregroundColor: "#000000",
    backgroundColor: "#eeeeee",
    primaryForegroundColor: "#000000",
    primaryColor: "#63a036",
    secondaryForegroundColor: "#ffffff",
    secondaryColor: "#007947",
    accentColor: "#3889cd",
    surfaceForegroundColor: "#000000",
    surfaceColor: "#b3dbd1",
    errorColor: "#ff624e"
};

export const darkTheme = {
    ...lightTheme,
    foregroundColor: "#ffffff",
    backgroundColor: "#2e2e2e",
    secondaryForegroundColor: "#000000",
    secondaryColor: "#63a036",
    primaryForegroundColor: "#ffffff",
    primaryColor: "#007947",
};

interface Props {
    children: React.ReactElement;
}

/*
 * Makes a styled-components global registry to get server-side inserted CSS
 * Adapted from https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
const StyleManager: React.FC<Props> = ({ children }) => {
    const [serverStyleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = serverStyleSheet.getStyleElement();
        serverStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") {
        return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>;
    }

    return (
        <StyleSheetManager sheet={serverStyleSheet.instance} shouldForwardProp={isPropValid}>
            <ThemeProvider theme={lightTheme}>
                <>
                    <GlobalStyle />
                    {children}
                </>
            </ThemeProvider>
        </StyleSheetManager>
    );
};

export default StyleManager;
