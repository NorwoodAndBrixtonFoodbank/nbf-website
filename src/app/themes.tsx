"use client";

import isPropValid from "@emotion/is-prop-valid";
import { useServerInsertedHTML } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import {
    ServerStyleSheet,
    StyleSheetManager,
    ThemeProvider,
    DefaultTheme,
} from "styled-components";
import MaterialAndGlobalStyle from "@/app/global_styles";
import useLocalStorage from "@/components/Hooks/useLocalStorage";

const BLACK = "#000000";
const WHITE = "#f2f2f2";

const rainbowColours = {
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
};

export const lightTheme: DefaultTheme = {
    light: true,
    main: {
        background: ["#fdfdfd", "#f6f6f6", "#eeeeee", "#dddddd"],
        foreground: ["#2d2d2d", "#2d2d2d", "#2d2d2d", "#2d2d2d"],
        largeForeground: ["#2d2d2d", "#2d2d2d", "#2d2d2d", "#2d2d2d"],
        lighterForeground: ["#666666", "#666666", "#666666", "#3b3b3b"],
        border: "#d5d5d5",
    },
    primary: {
        background: ["#e7f5e9", "#7fd495", "#02985a", "#05663f", "#222f28"],
        foreground: [BLACK, BLACK, BLACK, WHITE, WHITE],
        largeForeground: [BLACK, BLACK, WHITE, WHITE, WHITE],
    },
    accent: {
        background: "#1b385f",
        foreground: WHITE,
        largeForeground: WHITE,
    },
    error: "#c01622",
    shadow: "#e2e2e2",
    rainbow: rainbowColours,
    text: "#2d2d2d",
};

export const darkTheme: DefaultTheme = {
    light: false,
    main: {
        background: ["#111111", "#212121", "#2d2d2d", "#313131"],
        foreground: ["#d9d9d9", "#d9d9d9", "#d9d9d9", "#d9d9d9"],
        largeForeground: ["#d9d9d9", "#d9d9d9", "#d9d9d9", "#d9d9d9"],
        lighterForeground: ["#969696", "#969696", "#969696", "#bbbbbb"],
        border: "#5c5c5c",
    },
    primary: {
        background: [...lightTheme.primary.background].reverse(),
        foreground: [...lightTheme.primary.foreground].reverse(),
        largeForeground: [...lightTheme.primary.largeForeground].reverse(),
    },
    accent: {
        background: "#b8cbe9",
        foreground: "#2d2d2d",
        largeForeground: "#2d2d2d",
    },
    shadow: "#282828",
    error: "#ff7361",
    rainbow: rainbowColours,
    text: "#d9d9d9",
};

interface Props {
    children: React.ReactNode;
}

export const ThemeUpdateContext = createContext((dark: boolean): void => {
    throw new Error(
        `Attempted to set theme to ${
            dark ? "dark" : "light"
        } theme outside of a ThemeUpdateContext.Provider`
    );
});

type ThemePreference = "dark" | "light" | "system";
type SystemTheme = "light" | "dark";

const preferenceIsDark = (themePreference: ThemePreference, systemTheme: SystemTheme): boolean => {
    switch (themePreference) {
        case "dark":
            return true;
        case "light":
            return false;
        case "system":
            return systemTheme === "dark";
    }
};

const shouldForwardProp = (propName: string, target: unknown): boolean => {
    if (typeof target === "string") {
        return isPropValid(propName) as boolean;
    }
    return true;
};

const polyfillMediaQueryList = (mql: MediaQueryList): void => {
    // This is necessary because Safari <14 has incompatible MediaQueryList implementation.
    // This is not included in the standard core-js polyfills

    if (!mql.addEventListener && mql.addListener) {
        mql.addEventListener = <K extends keyof MediaQueryListEventMap>(
            type: K,
            listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => unknown
        ): void => {
            mql.addListener(listener);
        };
    }

    if (!mql.removeEventListener && mql.removeListener) {
        mql.removeEventListener = <K extends keyof MediaQueryListEventMap>(
            type: K,
            listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => unknown
        ): void => {
            mql.removeListener(listener);
        };
    }
};

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

    const [themePreference, setThemePreference] = useLocalStorage<ThemePreference>(
        "theme",
        "system"
    );

    const [systemTheme, setSystemTheme] = useState<SystemTheme>("light");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        polyfillMediaQueryList(mediaQuery);

        const listener = (event: MediaQueryListEvent): void => {
            setSystemTheme(event.matches ? "dark" : "light");
        };
        setSystemTheme(mediaQuery.matches ? "dark" : "light");

        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    const themeToggle = (dark: boolean): void => {
        setThemePreference(dark ? "dark" : "light");
    };

    return (
        <ThemeUpdateContext.Provider value={themeToggle}>
            <ThemeProvider
                theme={preferenceIsDark(themePreference, systemTheme) ? darkTheme : lightTheme}
            >
                <MaterialAndGlobalStyle>
                    <StyleSheetManager
                        shouldForwardProp={shouldForwardProp}
                        sheet={
                            typeof window === "undefined" ? serverStyleSheet.instance : undefined
                        }
                    >
                        {children}
                    </StyleSheetManager>
                </MaterialAndGlobalStyle>
            </ThemeProvider>
        </ThemeUpdateContext.Provider>
    );
};

export default StyleManager;
