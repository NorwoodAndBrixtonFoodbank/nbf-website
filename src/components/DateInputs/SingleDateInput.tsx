"use client";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const reasonableMinDate = dayjs("2020-01-01");

export interface DateRangeInputProps {
    setDate: (date: Dayjs) => void;
}

const SingleDateInput: React.FC<DateRangeInputProps> = (dateRangeInputProps) => {
    const setSingleDate = (date: Dayjs | null): void => {
        if (date) {
            dateRangeInputProps.setDate(date);
        }
    };

    return (
        <>
            <DatePicker
                onChange={(date) => setSingleDate(date)}
                minDate={reasonableMinDate}
                label="Date"
            />
        </>
    );
};

export default SingleDateInput;
