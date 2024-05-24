import React from "react";
import { ServerSideFilter, ServerSideFilterMethod } from "./Filters";
import DateRangeInputs, { DateRangeState } from "../DateInputs/DateRangeInputs";
import dayjs from "dayjs";

interface DateFilterProps<Data, DbData extends Record<string, any>> {
    key: keyof Data;
    label: string;
    method: ServerSideFilterMethod<DbData, DateRangeState>;
    initialState: DateRangeState;
}

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

export const serverSideDateFilter = <Data, DbData extends Record<string, any>>({
    key,
    method,
    initialState,
}: DateFilterProps<Data, DbData>): ServerSideFilter<Data, DateRangeState, DbData> => {
    return {
        key: key,
        state: initialState,
        initialState: initialState,
        method,
        areStatesIdentical: (stateA, stateB) => areDateRangesIdentical(stateA, stateB),
        filterComponent: function (
            state: DateRangeState,
            setState: (state: DateRangeState) => void
        ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
            return <DateRangeInputs range={state} setRange={setState}></DateRangeInputs>;
        },
    };
};
