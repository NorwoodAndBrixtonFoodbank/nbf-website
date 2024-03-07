"use client";

import React from "react";
import { KeyedFilter, defaultToString, keyedFilter } from "./Filters";
import CheckboxGroupPopup from "../DataInput/CheckboxGroupPopup";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import DateRangeInputs, { DateRangeState } from "../DateRangeInputs/DateRangeInputs";
import dayjs from "dayjs";

interface DateFilterProps<Data, Key extends keyof Data> {
    key: Key;
    filterLabel: string;
    filterMethod: (query: PostgrestFilterBuilder<Database["public"], any, any>, state: DateRangeState) => PostgrestFilterBuilder<Database["public"], any, any>
    initialState: DateRangeState;
}

export const dateFilter = <Data, Key extends keyof Data>({
    key,
    filterLabel,
    filterMethod,
    initialState
}: DateFilterProps<Data, Key>): KeyedFilter<Data, Key, DateRangeState> => {

    return keyedFilter(key, filterLabel, {
        state: initialState,
        initialState: initialState,
        filterMethod: filterMethod,
            filterComponent: function (
                state: DateRangeState,
                setState: (state: DateRangeState) => void
            ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
                return (
                    <DateRangeInputs
                    range={state}
                    setRange={setState}
                    ></DateRangeInputs>)
        },
    })
};
