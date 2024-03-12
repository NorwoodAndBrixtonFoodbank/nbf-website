"use client";

import React from "react";
import { Filter, MethodConfig } from "./Filters";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import DateRangeInputs, { DateRangeState } from "../DateRangeInputs/DateRangeInputs";

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
    return {
        key: key,
        state: initialState,
        initialState: initialState,
        methodConfig,
        filterComponent: function (
            state: DateRangeState,
            setState: (state: DateRangeState) => void
        ): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
            return <DateRangeInputs range={state} setRange={setState}></DateRangeInputs>;
        },
    };
};
