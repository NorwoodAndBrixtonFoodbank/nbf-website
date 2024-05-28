import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export enum PaginationType {
    Server = "SERVER",
    Client = "CLIENT",
}

export type ServerSideFilterMethod<DbData extends Record<string, any>, State> = (
    query: PostgrestFilterBuilder<Database["public"], DbData, any>,
    state: State
) => PostgrestFilterBuilder<Database["public"], DbData, any>;

export type ClientSideFilterMethod<Data, State> = (
    row: Data,
    state: State,
    key: keyof Data
) => boolean;

interface BasicFilter<Data, State> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    areStatesIdentical: (stateA: State, stateB: State) => boolean;
}

export interface ServerSideFilter<Data, State, DbData extends Record<string, any>>
    extends BasicFilter<Data, State> {
    method: ServerSideFilterMethod<DbData, State>;
}

export interface ClientSideFilter<Data, State> extends BasicFilter<Data, State> {
    method: ClientSideFilterMethod<Data, State>;
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
