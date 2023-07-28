import { Switch } from "@mui/material";
import styled from "styled-components";

import Sun from "./Sun.svg";
import Moon from "./Moon.svg";

const LightDarkSlider = styled(Switch)`
    width: 62px;
    height: 34px;
    padding: 7px;
    & .MuiSwitch-switchBase {
        margin: 1px;
        padding: 0;
        transform: translateX(6px);
        &.Mui-checked {
            transform: translateX(22px);
            & .MuiSwitch-thumb:before {
                background-image: url(${Moon.src});
            }
            & + .MuiSwitch-track {
                background-color: ${(props) => props.theme.accentBackgroundColor};
            }
        }
    }
    & .MuiSwitch-thumb {
        background-color: ${(props) => props.theme.accentBackgroundColor};
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
    & .MuiSwitch-track {
        background-color: ${(props) => props.theme.accentBackgroundColor};
        border-radius: 20px;
    }
`;
export default LightDarkSlider;
