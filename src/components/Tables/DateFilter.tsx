import React from "react";
import { ServerSideFilter, ServerSideFilterMethod } from "./Filters";
import DateRangeInputs, { DateRangeState } from "../DateInputs/DateRangeInputs";
import dayjs from "dayjs";

interface DateFilterProps<Data, DbData extends Record<string, unknown>> {
    key: keyof Data;
    label: string;
    method: ServerSideFilterMethod<DbData, DateRangeState>;
    initialState: DateRangeState;
    shouldPersistOnClear?: boolean;
    isDisabled?: boolean;
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

export const areDaysIdentical = (dayA: dayjs.Dayjs | null, dayB: dayjs.Dayjs | null): boolean => {
    return dayA && dayB ? dayA.isSame(dayB, "day") : dayA === dayB;
};

export const serverSideDateFilter = <Data, DbData extends Record<string, unknown>>({
    key,
    method,
    initialState,
    shouldPersistOnClear = false,
    isDisabled = false,
}: DateFilterProps<Data, DbData>): ServerSideFilter<Data, DateRangeState, DbData> => {
    return {
        key: key,
        state: initialState,
        initialState: initialState,
        method,
        shouldPersistOnClear: shouldPersistOnClear,
        isDisabled: isDisabled,
        areStatesIdentical: (stateA, stateB) => areDateRangesIdentical(stateA, stateB),
        filterComponent: function (
            state: DateRangeState,
            setState: (state: DateRangeState) => void,
            isDisabled: boolean
        ): React.ReactNode {
            return (
                <DateRangeInputs
                    key={key as string}
                    range={state}
                    setRange={setState}
                    isDisabled={isDisabled}
                />
            );
        },
    };
};
