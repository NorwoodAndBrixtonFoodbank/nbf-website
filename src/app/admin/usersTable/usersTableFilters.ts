import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import { UserRow } from "@/app/admin/page";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { UserRole } from "@/databaseUtils";

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

export const buildUserRoleFilter = (): Filter<UserRow, string[]> => {
    const userRoleSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("role", state);
    };

    const allUserRoles: UserRole[] = ["volunteer", "manager", "staff", "admin"];

    const userRoleFilter = checklistFilter<UserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: allUserRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: allUserRoles,
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });

    return userRoleFilter;
};
