import { ServerSideFilter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { ViewSchema } from "@/databaseUtils";

export type DbClientRow = ViewSchema["clients_plus"];
export type ClientsFilter = ServerSideFilter<ClientsTableRow, any, DbClientRow>;
export type ClientsSortState = SortState<ClientsTableRow, DbClientRow>;

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
