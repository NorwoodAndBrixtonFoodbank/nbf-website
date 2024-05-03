import { ServerSideFilter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { serverSideSortMethod } from "@/components/Tables/sortMethods";
import { Database } from "@/databaseTypesFile";
import { ViewSchema } from "@/databaseUtils";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export type DbClientRow = ViewSchema["clients_plus"];
export type ClientsFilter<State = any> = ServerSideFilter<ClientsTableRow, State, DbClientRow>;
export type ClientsSortMethod = serverSideSortMethod<DbClientRow>;
export type ClientsSortState = SortState<ClientsTableRow, ClientsSortMethod>;

export type GetClientsDataAndCountErrorType =
    | "abortedFetchingClientsTable"
    | "abortedFetchingClientsTableCount"
    | "failedToFetchClientsTable"
    | "failedToFetchClientsTableCount";

export type GetClientsReturnType =
    | {
          error: null;
          data: {
              clientData: ClientsTableRow[];
              count: number;
          };
      }
    | {
          error: { type: GetClientsDataAndCountErrorType; logId: string };
          data: null;
      };

export type GetClientsCountReturnType =
    | {
          error: { type: GetClientsDataAndCountErrorType; logId: string };
          data: null;
      }
    | {
          error: null;
          data: number;
      };

export interface ClientsTableRow {
    clientId: string;
    fullName: string;
    familyCategory: string;
    addressPostcode: string | null;
}

export type ClientsFilterMethod<State> = (
    query: PostgrestFilterBuilder<Database["public"], DbClientRow, any>,
    state: State
) => PostgrestFilterBuilder<Database["public"], DbClientRow, any>;
