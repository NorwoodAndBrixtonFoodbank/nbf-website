"use client";

import GlobalStyle from "@/app/global_styles";
import isPropValid from "@emotion/is-prop-valid";
import { useServerInsertedHTML } from "next/navigation";
import React, { createContext, useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";
import {
    ThemeProvider as MaterialThemeProvider,
    createTheme as createMaterialTheme,
} from "@mui/material";

type colorPalette = {
    background: string[];
    foreground: string[];
    largeForeground: string[];
};

type rainbowPalette = {
    red: string[];
    orange: string[];
    yellow: string[];
    lightGreen: string[];
    darkGreen: string[];
    blue: string[];
    purple: string[];
    grey: string[];
    brown: string[];
};

type customTheme = {
    light: boolean;
    main: colorPalette;
    primary: colorPalette;
    surface: colorPalette;
    error: string;
    rainbow: {
        color: rainbowPalette;
        foreground: rainbowPalette;
        largeForeground: rainbowPalette;
    };
};

const lightTheme: customTheme = {
    light: true,
    main: {
        background: ["#fdfdfd", "#f2f2f2", "#f2f2f2", "#f2f2f2"],
        foreground: ["#000000", "#2d2d2d", "#383838", "#6E6E6E"],
        largeForeground: ["#000000", "#2d2d2d", "#383838", "#6E6E6E"],
    },
    primary: {
        background: ["#a5eab3", "#7fde95", "#02985a", "#05663f", "#154d30"],
        foreground: ["#000000", "#000000", "#000000", "#ffffff", "#ffffff"],
        largeForeground: ["#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
    },
    surface: {
        background: ["#eeeeee", "#dbdbdb", "#aeaeae", "#707070", "#383838"],
        foreground: ["#000000", "#000000", "#000000", "#ffffff", "#ffffff"],
        largeForeground: ["#000000", "#000000", "#000000", "#ffffff", "#ffffff"],
    },
    error: "#ff624e",
    rainbow: {
        color: {
            red: ["#fa9189", "#fb685a", "#fc2a2a"],
            orange: ["#fcae7c", "#ff9753", "#fa6400"],
            yellow: ["#ffd868", "#ffcb1e", "#ffbb00"],
            lightGreen: ["#b4f5b3", "#7ceb98", "#1ae669"],
            darkGreen: ["#8ecbb4", "#66b79b", "#36d5a7"],
            blue: ["#acd5df", "#7bbafc", "#5b74f1"],
            purple: ["#ceaae9", "#a580f7", "#af25ff"],
            grey: ["#d7d7d7", "#959595", "#808080"],
            brown: ["#bfaba2", "#a49589", "#87735b"],
        },
        foreground: {
            red: ["#000000", "#000000", "#000000"],
            orange: ["#000000", "#000000", "#000000"],
            yellow: ["#000000", "#000000", "#000000"],
            lightGreen: ["#000000", "#000000", "#000000"],
            darkGreen: ["#000000", "#000000", "#000000"],
            blue: ["#000000", "#000000", "#000000"],
            purple: ["#000000", "#000000", "#000000"],
            grey: ["#000000", "#000000", "#000000"],
            brown: ["#000000", "#000000", "#000000"],
        },
        largeForeground: {
            red: ["#000000", "#000000", "#ffffff"],
            orange: ["#000000", "#000000", "#ffffff"],
            yellow: ["#000000", "#000000", "#000000"],
            lightGreen: ["#000000", "#000000", "#000000"],
            darkGreen: ["#000000", "#000000", "#000000"],
            blue: ["#000000", "#000000", "#ffffff"],
            purple: ["#000000", "#000000", "#ffffff"],
            grey: ["#000000", "#000000", "#ffffff"],
            brown: ["#000000", "#000000", "#ffffff"],
        },
    },
};

const darkTheme: customTheme = {
    ...lightTheme,
    light: false,
    main: {
        background: ["#202020", "#2d2d2d", "#2d2d2d", "#2d2d2d"],
        foreground: ["#ffffff", "#f2f2f2", "#B5B5B5", "#969696"],
        largeForeground: ["#ffffff", "#f2f2f2", "#B5B5B5", "#969696"],
    },
    primary: {
        background: lightTheme.primary.background.slice().reverse(),
        foreground: lightTheme.primary.foreground.slice().reverse(),
        largeForeground: lightTheme.primary.largeForeground.slice().reverse(),
    },
    surface: {
        background: ["#2d2d2d", "#383838", "#707070", "#aeaeae", "#dbdbdb"],
        foreground: ["#ffffff", "#ffffff", "#ffffff", "#000000", "#000000"],
        largeForeground: ["#ffffff", "#ffffff", "#ffffff", "#000000", "#000000"],
    },
};

interface Props {
    children: React.ReactElement;
    theme?: customTheme;
}

let forceRerender = 0;

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

    const materialTheme = createMaterialTheme({
        palette: {
            mode: chosenTheme === lightTheme ? "light" : "dark",
            primary: {
                main: chosenTheme.primary.background[2],
                contrastText: chosenTheme.primary.foreground[2],
            },
            secondary: {
                main: chosenTheme.primary.background[2],
                contrastText: chosenTheme.primary.foreground[2],
            },
            error: {
                main: chosenTheme.error,
            },
            background: {
                default: chosenTheme.main.background[1],
                paper: chosenTheme.surface.background[2],
            },
            text: {
                primary: chosenTheme.main.foreground[1],
            },
        },
        typography: {
            fontFamily: "Inter",
        },
        components: {
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: chosenTheme.primary.foreground[2],
                        accentColor: chosenTheme.primary.background[2],
                    },
                    colorPrimary: {
                        color: chosenTheme.primary.background[2],
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        fontSize: "1rem",
                        padding: "0.5rem",
                    },
                },
            },
        },
    });

    return (
        <ThemeUpdateContext.Provider value={handleThemeChange}>
            <ThemeProvider theme={chosenTheme} key={forceRerender++}>
                <MaterialThemeProvider theme={materialTheme}>
                    <GlobalStyle />
                    {themedChildren}
                </MaterialThemeProvider>
            </ThemeProvider>
        </ThemeUpdateContext.Provider>
    );
};

export default StyleManager;
