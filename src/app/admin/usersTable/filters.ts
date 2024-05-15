import { serverSideChecklistFilter } from "@/components/Tables/ChecklistFilter";
import { DbUserRow, UserRole } from "@/databaseUtils";
import { UserRow, UsersFilter, UsersFilterMethod, UsersFilters } from "./types";
import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import { usersTableHeaderKeysAndLabels } from "./headers";

const firstNameSearch: UsersFilterMethod<string> = (query, state) => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("first_name", `%${state}%`);
    }
};

const lastNameSearch: UsersFilterMethod<string> = (query, state) => {
    if (state === "") {
        return query;
    } else {
        return query.ilike("last_name", `%${state}%`);
    }
};

const emailSearch: UsersFilterMethod<string> = (query, state) => {
    return query.ilike("email", `%${state}%`);
};

const buildUserRoleFilter = (): UsersFilter<string[]> => {
    const userRoleSearch: UsersFilterMethod<string[]> = (query, state) => {
        return query.in("role", state);
    };

    const allUserRoles: UserRole[] = ["volunteer", "manager", "staff", "admin"];

    const userRoleFilter = serverSideChecklistFilter<UserRow, DbUserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: allUserRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: allUserRoles,
        method: userRoleSearch,
    });

    return userRoleFilter;
};

export const usersFilters: UsersFilters = [
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
