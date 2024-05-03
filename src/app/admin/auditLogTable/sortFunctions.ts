import { SortOptions } from "@/components/Tables/Table";
import { AuditLogRow, AuditLogSortMethod } from "./types";

export const auditLogTableSortableColumns: SortOptions<AuditLogRow, AuditLogSortMethod>[] = [
    {
        key: "action",
        sortMethod: (query, sortDirection) =>
            query.order("action", { ascending: sortDirection === "asc" }),
    },
    {
        key: "createdAt",
        sortMethod: (query, sortDirection) =>
            query.order("created_at", { ascending: sortDirection === "asc" }),
    },
    {
        key: "actorName",
        sortMethod: (query, sortDirection) =>
            query.order("actor_name", { ascending: sortDirection === "asc" }),
    },
    {
        key: "wasSuccess",
        sortMethod: (query, sortDirection) =>
            query.order("wasSuccess", { ascending: sortDirection === "asc" }),
    },
    {
        key: "logId",
        sortMethod: (query, sortDirection) =>
            query.order("log_id", { ascending: sortDirection === "asc" }),
    },
];
