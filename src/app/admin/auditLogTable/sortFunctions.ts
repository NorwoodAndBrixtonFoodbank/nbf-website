import { SortOptions } from "@/components/Tables/Table";
import { AuditLogRow } from "./types";
import { PaginationType } from "@/components/Tables/Filters";

export const auditLogTableSortableColumns: SortOptions<AuditLogRow>[] = [
    {
        key: "action",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("action", { ascending: sortDirection === "asc" }),
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
        key: "actorName",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("actor_name", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "wasSuccess",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("wasSuccess", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
    {
        key: "logId",
        sortMethodConfig: {
            method: (query, sortDirection) =>
                query.order("log_id", { ascending: sortDirection === "asc" }),
            paginationType: PaginationType.Server,
        },
    },
];
