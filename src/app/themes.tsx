"use client";

import GlobalStyle from "@/app/global_styles";
import isPropValid from "@emotion/is-prop-valid";
import { useServerInsertedHTML } from "next/navigation";
import React, { createContext, useState } from "react";
import {
    ServerStyleSheet,
    StyleSheetManager,
    ThemeProvider,
    DefaultTheme,
} from "styled-components";
import {
    ThemeProvider as MaterialThemeProvider,
    createTheme as createMaterialTheme,
} from "@mui/material";

// The array represents a gradient of color
// In light mode: 0 represents the lightest and larger index represents darker color
// In dark mode: reversed

const BLACK = "#000000";
const WHITE = "#f2f2f2";

export const lightTheme: DefaultTheme = {
    light: true,
    main: {
        background: ["#fdfdfd", "#eeeeee"],
        foreground: [BLACK, "#2d2d2d"],
        largeForeground: [BLACK, "#2d2d2d"],
        lighterForeground: "#666666",
        border: "#d5d5d5",
    },
    primary: {
        background: ["#a3e0b0", "#7fd495", "#02985a", "#05663f", "#154d30"],
        foreground: [BLACK, BLACK, BLACK, WHITE, WHITE],
        largeForeground: [BLACK, BLACK, WHITE, WHITE, WHITE],
    },
    accent: {
        background: "#1b385f",
        foreground: WHITE,
        largeForeground: WHITE,
    },
    error: "#ff624e",
    shadow: "#e2e2e2",
    rainbow: {
        lightRed: {
            background: "#fa9189",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkRed: {
            background: "#fc4942",
            foreground: BLACK,
            largeForeground: WHITE,
        },
        lightOrange: {
            background: "#fcae7c",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkOrange: {
            background: "#fd7e2a",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        lightYellow: {
            background: "#ffd868",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkYellow: {
            background: "#ffbb00",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        lightGreen: {
            background: "#b4f5b3",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkGreen: {
            background: "#5fa881",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        lightBlue: {
            background: "#acd5df",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkBlue: {
            background: "#7bbafc",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        lightPurple: {
            background: "#ceaae9",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkPurple: {
            background: "#b18ff9",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        lightGrey: {
            background: "#d7d7d7",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkGrey: {
            background: "#808080",
            foreground: BLACK,
            largeForeground: WHITE,
        },
        lightBrown: {
            background: "#bfaba2",
            foreground: BLACK,
            largeForeground: BLACK,
        },
        darkBrown: {
            background: "#a68f68",
            foreground: BLACK,
            largeForeground: BLACK,
        },
    },
};

export const darkTheme: DefaultTheme = {
    ...lightTheme,
    light: false,
    main: {
        background: ["#232323", "#2d2d2d"],
        foreground: [WHITE, "#d9d9d9"],
        largeForeground: [WHITE, "#d9d9d9"],
        lighterForeground: "#969696",
        border: "#5c5c5c",
    },
    primary: {
        background: lightTheme.primary.background.slice().reverse(),
        foreground: lightTheme.primary.foreground.slice().reverse(),
        largeForeground: lightTheme.primary.largeForeground.slice().reverse(),
    },
    accent: {
        background: "#b8cbe9",
        foreground: BLACK,
        largeForeground: BLACK,
    },
    shadow: "#282828",
};

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

interface Props {
    children: React.ReactElement;
    theme?: DefaultTheme;
}

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
            fontFamily: "Helvetica, Arial, sans-serif",
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
            <ThemeProvider theme={chosenTheme}>
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
