import { ServerSideFilter, ServerSideFilterMethod } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { ServerSideSortMethod } from "@/components/Tables/sortMethods";
import { DbUserRow, UserRole } from "@/databaseUtils";

export type UsersFilterMethod<State> = ServerSideFilterMethod<DbUserRow, State>;
export type UsersFilter<State> = ServerSideFilter<UserRow, State, DbUserRow>;
export type UsersFilters = (UsersFilter<string> | UsersFilter<string[]>)[];
export type UsersSortMethod = ServerSideSortMethod<DbUserRow>;
export type UsersSortState = SortState<UserRow, UsersSortMethod>;

export type GetUserDataAndCountErrorType =
    | "abortedFetchingProfilesTable"
    | "abortedFetchingProfilesTableCount"
    | "failedToFetchProfilesTable"
    | "failedToFetchProfilesTableCount";

export type GetUsersReturnType =
    | {
          data: {
              userData: UserRow[];
              count: number;
          };
          error: null;
      }
    | {
          data: null;
          error: { type: GetUserDataAndCountErrorType; logId: string };
      };

export type GetUserCountReturnType =
    | {
          data: null;
          error: { type: GetUserDataAndCountErrorType; logId: string };
      }
    | {
          data: number;
          error: null;
      };

export type DisplayedUserRole = UserRole | "UNKNOWN";
export interface UserRow {
    userId: string;
    profileId: string;
    firstName: string;
    lastName: string;
    userRole: DisplayedUserRole;
    email: string;
    telephoneNumber: string;
    createdAt: number | null;
    updatedAt: number | null;
}
