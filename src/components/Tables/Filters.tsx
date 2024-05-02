import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export enum PaginationType {
    Server = "SERVER",
    Client = "CLIENT",
}

export type ServerSideMethod<Data, State, DbRow extends Record<string, any>> = (
              query: PostgrestFilterBuilder<Database["public"], DbRow, any>,
              state: State
          ) => PostgrestFilterBuilder<Database["public"], DbRow, any>;

      export type ClientSideMethod<Data, State> =
            (row: Data, state: State, key: keyof Data) => boolean;
  

export interface ServerSideFilter<Data, State, DbRow extends Record<string, any>> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    method: ServerSideMethod<Data, State, DbRow>;
    areStatesIdentical: (stateA: State, stateB: State) => boolean;
}

export interface ClientSideFilter<Data, State> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    method: ClientSideMethod<Data, State>;
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
