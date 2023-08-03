"use client";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {
    label?: string;
    defaultValue?: string;
    onChange?: any;
    error?: boolean;
    helperText?: string;
}

const DatePickerInput: React.FC<Props> = (props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={props.label}
                format="DD-MM-YYYY"
                onChange={props.onChange}
                closeOnSelect
            />
        </LocalizationProvider>
    );
};
export default DatePickerInput;
