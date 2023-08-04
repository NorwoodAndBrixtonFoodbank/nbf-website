import styled from "styled-components";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const StyledDatePicker = styled(DatePicker)`
    & .MuiInputBase-root {
        & .MuiInputBase-input {
            // pushes calendar icon to the right
            width: 10000%;
        }
    }
`;

export default StyledDatePicker;
