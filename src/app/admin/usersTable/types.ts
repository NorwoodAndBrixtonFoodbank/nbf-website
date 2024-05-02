import { ServerSideFilter } from "@/components/Tables/Filters";
import { SortState } from "@/components/Tables/Table";
import { UserRole, ViewSchema } from "@/databaseUtils";

export type DbUserRow = ViewSchema["users_plus"];
export type UsersFilter<State> = ServerSideFilter<UserRow, State, DbUserRow>;
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
