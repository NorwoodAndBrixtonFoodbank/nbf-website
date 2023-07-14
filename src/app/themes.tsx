"use client";

import GlobalStyle from "@/app/global_styles";
import { useServerInsertedHTML } from "next/navigation";
import React, { useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

export const lightTheme = {
    foregroundColor: "#000",
    backgroundColor: "#fff",
    primaryForegroundColor: "#fff",
    primaryBackgroundColor: "#007947",
    secondaryForegroundColor: "#000",
    secondaryBackgroundColor: "#63a036",
    accentColor: "#3889cd",
    surfaceForegroundColor: "#000",
    surfaceBackgroundColor: "#b3dbd1",
    errorColor: "#ff624e"
};


// tertiaryColor
// disabledColor
// pressedColor


export const darkTheme = {
    ...lightTheme, 
    backgroundColor: "#1f1a24",
    foregroundColor: "#fff",
}

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
        return <>{children}</>;
    }

    return (
        <StyleSheetManager sheet={serverStyleSheet.instance}>
            <ThemeProvider theme={darkTheme}>
                <>
                    <GlobalStyle />
                    {children}
                </>
            </ThemeProvider>
        </StyleSheetManager>
    );
};

export default StyleManager;
