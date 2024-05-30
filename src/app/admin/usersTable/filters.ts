import { serverSideChecklistFilter } from "@/components/Tables/ChecklistFilter";
import { DbUserRow } from "@/databaseUtils";
import { UserRow, UsersFilter, UsersFilterMethod, UsersFilters } from "./types";
import { buildServerSideTextFilter } from "@/components/Tables/TextFilter";
import { usersTableHeaderKeysAndLabels } from "./headers";
import { allRoles } from "@/app/roles";

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

    const userRoleFilter = serverSideChecklistFilter<UserRow, DbUserRow>({
        key: "userRole",
        filterLabel: "User Role",
        itemLabelsAndKeys: allRoles.map((userRole) => [userRole, userRole]),
        initialCheckedKeys: allRoles,
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
