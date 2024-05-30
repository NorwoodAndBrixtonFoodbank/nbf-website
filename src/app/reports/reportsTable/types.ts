import { SortState } from "@/components/Tables/Table";
import { ServerSideSortMethod } from "@/components/Tables/sortMethods";
import { DbReportRow } from "@/databaseUtils";

export type ReportsSortMethod = ServerSideSortMethod<DbReportRow>;
export type ReportsSortState = SortState<ReportsTableRow, ReportsSortMethod>;

export type GetReportsDataAndCountErrorType =
    | "abortedFetchingReportsTable"
    | "abortedFetchingReportsTableCount"
    | "failedToFetchReportsTable"
    | "failedToFetchReportsTableCount";

export type GetReportsReturnType =
    | {
          error: null;
          data: {
              reportsData: ReportsTableRow[];
              count: number;
          };
      }
    | {
          error: { type: GetReportsDataAndCountErrorType; logId: string };
          data: null;
      };

export type GetReportsCountReturnType =
    | {
          error: { type: GetReportsDataAndCountErrorType; logId: string };
          data: null;
      }
    | {
          error: null;
          data: number;
      };

export interface ReportsTableRow {
    weekCommencing: string;
    total: number;
    familySize1: number;
    familySize2: number;
    familySize3: number;
    familySize4: number;
    familySize5: number;
    familySize6: number;
    familySize7: number;
    familySize8: number;
    familySize9: number;
    familySize10Plus: number;
    totalWithPets: number;
    catOnly: number;
    dogOnly: number;
    catAndDog: number;
}
