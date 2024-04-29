import { TableHeaders } from "@/components/Tables/Table";
import { AuditLogRow } from "./types";

export const auditLogTableHeaderKeysAndLabels: TableHeaders<AuditLogRow> = [
    ["action", "Action"],
    ["createdAt", "Time"],
    ["actorName", "User"],
    ["content", "Content"],
    ["wasSuccess", "Success"],
    ["logId", "Log ID"],
];
