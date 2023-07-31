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
    main: {
        background: string[];
        foreground: string[];
        largeForeground: string[];
        border: string;
    };
    primary: {
        background: string[];
        foreground: string[];
        largeForeground: string[];
    };
    error: string;
    shadow: string;
    rainbow: {
        color: rainbowPalette;
        foreground: rainbowPalette;
        largeForeground: rainbowPalette;
    };
};

export const lightTheme: customTheme = {
    light: true,
    main: {
        background: ["#fdfdfd", "#eeeeee", "#eeeeee", "#eeeeee"],
        foreground: ["#000000", "#2d2d2d", "#383838", "#6e6e6e"],
        largeForeground: ["#000000", "#2d2d2d", "#383838", "#6e6e6e"],
        border: "#d5d5d5",
    },
    primary: {
        background: ["#a3e0b0", "#8cd99d", "#02985a", "#05663f", "#154d30"],
        foreground: ["#000000", "#000000", "#000000", "#f2f2f2", "#f2f2f2"],
        largeForeground: ["#000000", "#f2f2f2", "#f2f2f2", "#f2f2f2", "#f2f2f2"],
    },
    error: "#ff624e",
    shadow: "#e2e2e2",
    rainbow: {
        color: {
            red: ["#fa9189", "#fb685a", "#fc2a2a"],
            orange: ["#fcae7c", "#ff9753", "#fa6400"],
            yellow: ["#ffd868", "#ffcb1e", "#ffbb00"],
            lightGreen: ["#b4f5b3", "#7ceb98", "#1ae669"],
            darkGreen: ["#8ecbb4", "#66b79b", "#36d5a7"],
            blue: ["#acd5df", "#7bbafc", "#5b74f1"],
            purple: ["#ceaae9", "#b18ff9", "#af25ff"],
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
            red: ["#000000", "#000000", "#f2f2f2"],
            orange: ["#000000", "#000000", "#f2f2f2"],
            yellow: ["#000000", "#000000", "#000000"],
            lightGreen: ["#000000", "#000000", "#000000"],
            darkGreen: ["#000000", "#000000", "#000000"],
            blue: ["#000000", "#000000", "#f2f2f2"],
            purple: ["#000000", "#000000", "#f2f2f2"],
            grey: ["#000000", "#000000", "#f2f2f2"],
            brown: ["#000000", "#000000", "#f2f2f2"],
        },
    },
};

export const darkTheme: customTheme = {
    ...lightTheme,
    light: false,
    main: {
        background: ["#232323", "#2d2d2d", "#2d2d2d", "#2d2d2d"],
        foreground: ["#d9d9d9", "#d9d9d9", "#B5B5B5", "#969696"],
        largeForeground: ["#f2f2f2", "#ededed", "#B5B5B5", "#969696"],
        border: "#5c5c5c",
    },
    primary: {
        background: lightTheme.primary.background.slice().reverse(),
        foreground: lightTheme.primary.foreground.slice().reverse(),
        largeForeground: lightTheme.primary.largeForeground.slice().reverse(),
    },
    shadow: "#282828",
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
export const ChosenThemeContext = createContext(lightTheme);

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
                paper: chosenTheme.main.background[0],
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
                    <ChosenThemeContext.Provider value={chosenTheme}>
                        <GlobalStyle />
                        {themedChildren}
                    </ChosenThemeContext.Provider>
                </MaterialThemeProvider>
            </ThemeProvider>
        </ThemeUpdateContext.Provider>
    );
};

export default StyleManager;
