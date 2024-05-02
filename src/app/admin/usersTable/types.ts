import { Filter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { UserRole, ViewSchema } from "@/databaseUtils";

export type DbUserRow = ViewSchema["profiles_plus"];
export type UsersFilter = Filter<UserRow, any, DbUserRow>;
export type UsersSortState = SortState<UserRow, DbUserRow>;

export type GetUserDataAndCountErrorType =
    | "abortedFetchingProfilesTable"
    | "abortedFetchingProfilesTableCount"
    | "failedToFetchProfilesTable"
    | "failedToFetchProfilesTableCount";

export type GetUsersReturnType =
    | {
          error: null;
          data: {
              userData: UserRow[];
              count: number;
          };
      }
    | {
          error: { type: GetUserDataAndCountErrorType; logId: string };
          data: null;
      };

export type GetUserCountReturnType =
    | {
          error: { type: GetUserDataAndCountErrorType; logId: string };
          data: null;
      }
    | {
          error: null;
          data: number;
      };

type BuildUserRoleFilterErrors = "failedToFetchUserRoleFilterOptions";

export type BuildUserRoleFilterAndError =
    | {
          data: UsersFilter;
          error: null;
      }
    | {
          data: null;
          error: { type: BuildUserRoleFilterErrors; logId: string };
      };

export type DisplayedUserRole = UserRole | "UNKNOWN";
export interface UserRow {
    id: string;
    firstName: string;
    lastName: string;
    userRole: DisplayedUserRole;
    email: string;
    telephoneNumber: string;
    createdAt: number | null;
    updatedAt: number | null;
}
