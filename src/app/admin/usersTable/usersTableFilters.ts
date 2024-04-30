import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { UserRow } from "@/app/admin/page";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { UserRole } from "@/databaseUtils";

type BuildUserRoleFilterErrors = "failedToFetchUserRoleFilterOptions";

type BuildUserRoleFilterAndError =
    | {
          data: Filter<UserRow, string[]>;
          error: null;
      }
    | {
          data: null;
          error: { type: BuildUserRoleFilterErrors; logId: string };
      };

export const firstNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("first_name", `%${state}%`);
    }
};

export const lastNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("last_name", `%${state}%`);
    }
};

export const emailSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("email", `%${state}%`);
};

export const buildUserRoleFilter = async (): Promise<BuildUserRoleFilterAndError> => {
    const userRoleSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("role", state);
    };

    const { data, error } = await supabase.from("profiles").select("role");

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: User role filter options", {
            error: error,
        });
        return { data: null, error: { type: "failedToFetchUserRoleFilterOptions", logId: logId } };
    }

    const userRolesFromDb: UserRole[] = data.map((row) => row.role) ?? [];

    const userRoleFilter = checklistFilter<UserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: userRolesFromDb.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: userRolesFromDb,
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });

    return { data: userRoleFilter, error: null };
};
