import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { UserRow } from "@/app/admin/page";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { UserRole } from "@/databaseUtils";

export const firstNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("first_name", `%${state}%`);
};

export const lastNameSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("last_name", `%${state}%`);
};

export const emailSearch = (
    query: PostgrestFilterBuilder<Database["public"], any, any>,
    state: string
): PostgrestFilterBuilder<Database["public"], any, any> => {
    return query.ilike("email", `%${state}%`);
};

export const buildUserRoleFilter = async (): Promise<Filter<UserRow, string[]>> => {
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
        throw new DatabaseError("fetch", "user role filter options", logId);
    }

    const userRolesFromDb: UserRole[] = data.map((row) => row.role) ?? [];

    const uniqueUserRoles = userRolesFromDb.reduce<UserRole[]>((accumulator, userRole) => {
        if (!accumulator.includes(userRole)) {
            accumulator.push(userRole);
        }
        return accumulator;
    }, []);

    uniqueUserRoles.sort();

    return checklistFilter<UserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: uniqueUserRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: uniqueUserRoles,
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });
};
