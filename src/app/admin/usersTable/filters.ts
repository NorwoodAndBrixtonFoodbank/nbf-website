import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { PaginationType } from "@/components/Tables/Filters";
import { checklistFilter } from "@/components/Tables/ChecklistFilter";
import { UserRole } from "@/databaseUtils";
import { DbUserRow, UserRow, UsersFilter } from "./types";
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

export const buildUserRoleFilter = (): UsersFilter<string[]> => {
    const userRoleSearch = (
        query: PostgrestFilterBuilder<Database["public"], any, any>,
        state: string[]
    ): PostgrestFilterBuilder<Database["public"], any, any> => {
        return query.in("role", state);
    };

    const allUserRoles: UserRole[] = ["volunteer", "manager", "staff", "admin"];

    const userRoleFilter = checklistFilter<UserRow, DbUserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: allUserRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: allUserRoles,
        methodConfig: { paginationType: PaginationType.Server, method: userRoleSearch },
    });

    return userRoleFilter;
};

export const usersFilters: UsersFilter<any>[] = [
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
        method: lastNameSearch,
    }),
    buildServerSideTextFilter({
        key: "email",
        label: "Email",
        headers: usersTableHeaderKeysAndLabels,
        method: emailSearch,
    }),
    buildUserRoleFilter(),
];
