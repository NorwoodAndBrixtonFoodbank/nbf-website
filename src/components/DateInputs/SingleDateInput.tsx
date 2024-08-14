"use client";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const reasonableMinDate = dayjs("2020-01-01");

export interface DateInputProps {
    setDate: (date: Dayjs) => void;
}

const SingleDateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
    (dateInputProps, dateInputFocusRef) => {
        const setSingleDate = (date: Dayjs | null): void => {
            if (date) {
                dateInputProps.setDate(date);
            }
        };

        return (
            <>
                <DatePicker
                    onChange={(date) => setSingleDate(date)}
                    minDate={reasonableMinDate}
                    label="Date"
                    inputRef={dateInputFocusRef}
                />
            </>
        );
    }
);

SingleDateInput.displayName = "SingleDateInput";

export default SingleDateInput;
