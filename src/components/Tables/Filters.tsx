import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export type MethodConfig<Data, State> = {method: (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: State
) => PostgrestFilterBuilder<Database["public"], any, any>; methodType: "query"; } | {method: (data: Data[], state: State, key: keyof Data) => Data[]; methodType: "data";};

export interface Filter<Data, State> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    methodConfig: MethodConfig<Data, State>;
}

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


export const filterRowByText = <Data,>(row: Data, state: string, key: keyof Data): boolean => {
    let string = defaultToString(row[key]);
    string = string.toLowerCase();
    state = state.toLowerCase();

    return !string.includes(state);
};

export const filterDataByText = <Data,>(data: Data[], state: string, key: keyof Data): Data[] => (
     data.filter((row)=>filterRowByText(row, state, key))
)