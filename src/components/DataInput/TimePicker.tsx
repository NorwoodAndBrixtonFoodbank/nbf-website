import styled from "styled-components";
import { DesktopTimePicker } from "@mui/x-date-pickers";

const StyledTimePicker = styled(DesktopTimePicker)`
    & .MuiInputBase-root {
        & .MuiInputBase-input {
            // pushes clock icon to the right
            width: 10000%;
        }
    }
`;

export default StyledTimePicker;
