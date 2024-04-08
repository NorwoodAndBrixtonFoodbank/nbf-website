"use client";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import utc from 'dayjs/plugin/utc';

const reasonableMinDate = dayjs("2020-01-01").utc();
dayjs.extend(utc);

export interface DateRangeState {
    from: Dayjs | null;
    to: Dayjs | null;
}

interface Props {
    range: DateRangeState;
    setRange?: (range: DateRangeState) => void;
}

const DateRangeInputs: React.FC<Props> = (props) => {
    const isRangeValid = (from: Dayjs | null, to: Dayjs | null): boolean => {
        return (
            from !== null &&
            to !== null &&
            from >= reasonableMinDate &&
            to >= reasonableMinDate &&
            from <= to
        );
    };

    const setRangeIfPossible = (from: Dayjs | null, to: Dayjs | null): void => {
        if (props.setRange && isRangeValid(from, to)) {
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
