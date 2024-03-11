import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface Filter<State> {
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    filterMethod: (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: State
    ) => PostgrestFilterBuilder<Database["public"], any, any>;
}

export interface KeyedFilter<Data, Key extends keyof Data, State> extends Filter<State> {
    key: Key;
    label: string;
}

export const isKeyedFilter = <Data, Key extends keyof Data, State>(
    filter: Filter<State>
): filter is KeyedFilter<Data, Key, State> => {
    return "key" in filter;
};

export const keyedFilter = <Data, Key extends keyof Data, State>(
    key: Key,
    label: string,
    filter: Filter<State>
): KeyedFilter<Data, Key, State> => {
    return {
        key,
        label,
        ...filter,
    };
};

export const headerLabelFromKey = <Data, Key extends keyof Data>(
    headers: TableHeaders<Data>,
    key: Key
): string => {
    return headers.find(([headerKey]) => headerKey === key)?.[1] ?? key.toString();
};

export const defaultToString = (value: unknown): string => {
    if (typeof value === "string") {
        return value;
    }

    return JSON.stringify(value);
};
