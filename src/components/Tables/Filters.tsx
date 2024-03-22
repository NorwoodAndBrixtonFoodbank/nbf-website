import React from "react";
import { TableHeaders } from "@/components/Tables/Table";
import { Database } from "@/databaseTypesFile";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export enum PaginationType {
    Server = "SERVER",
    Client = "CLIENT",
}

export type MethodConfig<Data, State> =
    | {
          method: (
              query: PostgrestFilterBuilder<Database["public"], any, any>,
              state: State
          ) => PostgrestFilterBuilder<Database["public"], any, any>;
          paginationType: PaginationType.Server;
      }
    | {
          method: (row: Data, state: State, key: keyof Data) => boolean;
          paginationType: PaginationType.Client;
      };

export interface Filter<Data, State> {
    key: keyof Data;
    filterComponent: (state: State, setState: (state: State) => void) => React.ReactElement;
    state: State;
    initialState: State;
    methodConfig: MethodConfig<Data, State>;
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
