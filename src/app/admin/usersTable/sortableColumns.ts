import { PaginationType } from "@/components/Tables/Filters";
import { SortOptions } from "@/components/Tables/Table";
import { UserRow, DBUserRow } from "./types";

export const usersSortableColumns: SortOptions<UserRow, DBUserRow>[] = [
    {
        key: "firstName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("first_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "lastName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("last_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "userRole",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("role", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "email",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("email", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "telephoneNumber",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("telephone_number", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "createdAt",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("created_at", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "updatedAt",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("updated_at", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];
