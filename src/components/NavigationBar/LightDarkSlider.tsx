"use client";

import { FormLabel, Switch } from "@mui/material";
import styled, { useTheme } from "styled-components";
import React, { useContext } from "react";

import Sun from "@/components/NavigationBar/Sun.svg";
import Moon from "@/components/NavigationBar/Moon.svg";
import { ThemeUpdateContext } from "@/app/themes";

const StyledSwitch = styled(Switch)`
    // sets the size of the switch
    width: 62px;
    height: 34px;
    padding: 7px;
    & .MuiSwitch-switchBase {
        margin: 1px;
        padding: 0;
        transform: translateX(6px);
        &.Mui-checked {
            transform: translateX(22px);
            // the circle section specifically when the switch is checked
            & .MuiSwitch-thumb:before {
                background-image: url(${Moon.src});
            }
            // the track specifically when the switch is checked
            & + .MuiSwitch-track {
                background-color: ${(props) => props.theme.accent.background};
            }
        }
    }
    & .MuiSwitch-thumb {
        // sets the circle section for when the switch is not checked
        background-color: ${(props) => props.theme.accent.background};
        width: 32px;
        height: 32px;
        &:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-image: url(${Sun.src});
        }
    }
    // sets the track for when the switch is not checked
    & .MuiSwitch-track {
        background-color: ${(props) => props.theme.accent.background};
        border-radius: 20px;
    }
`;

const LightDarkSlider: React.FC = () => {
    const setThemeMode = useContext(ThemeUpdateContext);
    const theme = useTheme();

    const switchThemeMode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setThemeMode(event.target.checked);
    };

    return (
        <FormLabel aria-label="Theme Switch">
            <StyledSwitch onChange={switchThemeMode} checked={!theme.light} />
        </FormLabel>
    );
};

export default LightDarkSlider;
