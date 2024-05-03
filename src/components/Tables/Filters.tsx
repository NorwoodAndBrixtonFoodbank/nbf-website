import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export enum PaginationType {
    Server = "SERVER",
    Client = "CLIENT",
}

type ColumnExists<
    DbData extends Record<string, any>,
    ColumnName extends string,
> = ColumnName extends keyof DbData ? true : false;

export type ServerSideFilterMethod<DbData extends Record<string, any>, State> = (
    query: PostgrestFilterBuilder<Database["public"], DbData, any>,
    state: State
) => {
    [K in Extract<keyof DbData, string>]: ColumnExists<DbData, K> extends true
        ? PostgrestFilterBuilder<Database["public"], DbData, any>
        : never;
}[Extract<keyof DbData, string>];

export type ClientSideFilterMethod<Data, State> = (
    row: Data,
    state: State,
    key: keyof Data
) => boolean;

export interface ServerSideFilter<Data, State, DbData extends Record<string, any>> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    method: ServerSideFilterMethod<DbData, State>;
    areStatesIdentical: (stateA: State, stateB: State) => boolean;
}

export interface ClientSideFilter<Data, State> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    method: ClientSideFilterMethod<Data, State>;
    areStatesIdentical: (stateA: State, stateB: State) => boolean;
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

export interface CoreFilter<State = any> {
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
}
