import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { PaginationType } from "@/components/Tables/Filters";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { UserRole } from "@/databaseUtils";
import { BuildUserRoleFilterAndError, DbUserRow, UserRow, UsersFilter } from "./types";
import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import { usersTableHeaderKeysAndLabels } from "./headers";

const firstNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("first_name", `%${state}%`);
    }
};

const lastNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("last_name", `%${state}%`);
    }
};

const emailSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("email", `%${state}%`);
};

const buildUserRoleFilter = async (): Promise<BuildUserRoleFilterAndError> => {
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

    const uniqueUserRoles = userRolesFromDb.reduce<UserRole[]>((accumulator, userRole) => {
        if (!accumulator.includes(userRole)) {
            accumulator.push(userRole);
        }
        return accumulator;
    }, []);

    uniqueUserRoles.sort();

    const userRoleFilter = checklistFilter<UserRow, DbUserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: uniqueUserRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: uniqueUserRoles,
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });

    return { data: userRoleFilter, error: null };
};

export const usersFilters: UsersFilter[] = [
    buildServerSideTextFilter({
        key: "firstName",
        label: "First Name",
        headers: usersTableHeaderKeysAndLabels,
            method: firstNameSearch,
    }),
    buildServerSideTextFilter({
        key: "lastName",
        label: "Last Name",
        headers: usersTableHeaderKeysAndLabels,
        method:
         lastNameSearch,
        
    }),
    buildServerSideTextFilter({
        key: "email",
        label: "Email",
        headers: usersTableHeaderKeysAndLabels,
        method: 
            emailSearch,
        
    })]