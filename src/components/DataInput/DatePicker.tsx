import styled from "styled-components";
import { DesktopDatePicker } from "@mui/x-date-pickers";

const StyledDatePicker = styled(DesktopDatePicker)`
    & .MuiInputBase-root {
        & .MuiInputBase-input {
            // pushes calendar icon to the right
            width: 10000%;
        }
    }
`;

export default StyledDatePicker;
