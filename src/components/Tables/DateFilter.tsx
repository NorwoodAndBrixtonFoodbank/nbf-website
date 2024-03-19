"use client";

import React from "react";
import { Filter, MethodConfig } from "./Filters";
import DateRangeInputs, { DateRangeState } from "../DateRangeInputs/DateRangeInputs";
import dayjs from "dayjs";

interface DateFilterProps<Data> {
    key: keyof Data;
    label: string;
    methodConfig: MethodConfig<Data, DateRangeState>;
    initialState: DateRangeState;
}

export const dateFilter = <Data,>({
    key,
    methodConfig,
    initialState,
}: DateFilterProps<Data>): Filter<Data, DateRangeState> => {
    const areDateRangesIdentical = (
        dateRangeA: DateRangeState,
        dateRangeB: DateRangeState
    ): boolean => {
        return (
            areDaysIdentical(dateRangeA.from, dateRangeB.from) &&
            areDaysIdentical(dateRangeA.to, dateRangeB.to)
        );
    };

    const areDaysIdentical = (dayA: dayjs.Dayjs | null, dayB: dayjs.Dayjs | null): boolean => {
        return dayA && dayB ? dayA.isSame(dayB) : dayA === dayB;
    };
    return {
        key: key,
        state: initialState,
        initialState: initialState,
        methodConfig,
        areStatesIdentical: (stateA, stateB) => areDateRangesIdentical(stateA, stateB),
        filterComponent: function (
            state: DateRangeState,
            setState: (state: DateRangeState) => void
        ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
            return <DateRangeInputs range={state} setRange={setState}></DateRangeInputs>;
        },
    };
};
