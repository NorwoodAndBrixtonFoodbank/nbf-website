"use client";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";

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
    const [localFromValue, setLocalFromValue] = useState<Dayjs | null>(props.range.from);
    const [localToValue, setLocalToValue] = useState<Dayjs | null>(props.range.to);
    const [hasErrorState, setHasErrorState] = useState<boolean>(false);

    const isRangeValid = (from: Dayjs, to: Dayjs): boolean => {
        return from >= reasonableMinDate && to >= reasonableMinDate && from <= to;
    };

    const setRangeIfPossible = (from: Dayjs | null, to: Dayjs | null): void => {
        if (from && to && isRangeValid(from, to)) {
            setHasErrorState(false);

            props.setRange({
                from: from,
                to: to,
            });
        } else {
            setHasErrorState(true);
        }
    };

    const setFromValue = (fromValue: Dayjs | null): void => {
        setLocalFromValue(fromValue);
        setRangeIfPossible(fromValue, localToValue);
    };

    const setToValue = (toValue: Dayjs | null): void => {
        setLocalToValue(toValue);
        setRangeIfPossible(localFromValue, toValue);
    };

    return (
        <>
            <DatePicker
                onChange={(value) => setFromValue(value)}
                minDate={reasonableMinDate}
                value={props.range.from}
                label="From"
                slotProps={{
                    textField: {
                        error: hasErrorState,
                    },
                }}
            />
            <DatePicker
                onChange={(value) => setToValue(value)}
                minDate={reasonableMinDate}
                value={props.range.to}
                label="To"
                slotProps={{
                    textField: {
                        error: hasErrorState,
                    },
                }}
            />
        </>
    );
};

export default DateRangeInputs;
