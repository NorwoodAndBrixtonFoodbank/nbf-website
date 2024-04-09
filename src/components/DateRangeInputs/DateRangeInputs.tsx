"use client";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const reasonableMinDate = dayjs("2020-01-01");

export interface DateRangeState {
    from: Dayjs;
    to: Dayjs;
}

interface Props {
    range: DateRangeState;
    setRange: (range: DateRangeState) => void;
}

const DateRangeInputs: React.FC<Props> = (props) => {
    const isRangeValid = (from: Dayjs, to: Dayjs): boolean => {
        return from >= reasonableMinDate && to >= reasonableMinDate && from <= to;
    };

    const setRangeIfPossible = (from: Dayjs | null, to: Dayjs | null): void => {
        if (from && to && isRangeValid(from, to)) {
            props.setRange({
                from: from,
                to: to,
            });
        }
    };

    return (
        <>
            <DatePicker
                onChange={(value) => setRangeIfPossible(value, props.range.to)}
                minDate={reasonableMinDate}
                maxDate={props.range.to}
                value={props.range.from}
                label="From"
            />
            <DatePicker
                onChange={(value) => setRangeIfPossible(props.range.from, value)}
                minDate={props.range.from || reasonableMinDate}
                value={props.range.to}
                label="To"
            />
        </>
    );
};

export default DateRangeInputs;
