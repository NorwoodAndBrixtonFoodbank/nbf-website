import styled from "styled-components";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const StyledTimePicker = styled(TimePicker)`
    & .MuiInputBase-root {
        & .MuiInputBase-input {
            // pushes clock icon to the right
            width: 10000%;
        }
    }
`;

export default StyledTimePicker;
