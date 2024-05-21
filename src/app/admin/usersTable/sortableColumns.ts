import { SortOptions } from "@/components/Tables/Table";
import { UserRow, UsersSortMethod } from "./types";

export const usersSortableColumns: SortOptions<UserRow, UsersSortMethod>[] = [
    {
        key: "firstName",
        sortMethod: (query, sortDirection) =>
            query.order("first_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "lastName",
        sortMethod: (query, sortDirection) =>
            query.order("last_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "userRole",
        sortMethod: (query, sortDirection) =>
            query.order("role", { ascending: sortDirection === "asc" }),
    },
    {
        key: "email",
        sortMethod: (query, sortDirection) =>
            query.order("email", { ascending: sortDirection === "asc" }),
    },
    {
        key: "telephoneNumber",
        sortMethod: (query, sortDirection) =>
            query.order("telephone_number", { ascending: sortDirection === "asc" }),
    },
    {
        key: "createdAt",
        sortMethod: (query, sortDirection) =>
            query.order("created_at", { ascending: sortDirection === "asc" }),
    },
    {
        key: "updatedAt",
        sortMethod: (query, sortDirection) =>
            query.order("updated_at", { ascending: sortDirection === "asc" }),
    },
];
