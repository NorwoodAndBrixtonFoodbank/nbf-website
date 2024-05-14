import { capitaliseWords, formatBooleanOrNull, formatDateTime } from "@/common/format";
import { AuditLogCountError, AuditLogError } from "./fetchAuditLogData";
import { UserRole } from "@/databaseUtils";

export const auditLogTableColumnDisplayFunctions = {
    createdAt: formatDateTime,
    wasSuccess: formatBooleanOrNull,
};

export const getAuditLogErrorMessage = (error: AuditLogError | AuditLogCountError): string => {
    let errorMessage: string = "";
    switch (error.type) {
        case "failedAuditLogFetch":
            errorMessage = "Failed to fetch audit log.";
            break;
        case "failedAuditLogCountFetch":
            errorMessage = "Failed to fetch audit log count.";
            break;
        case "nullCount":
            errorMessage = "Audit log table empty.";
    }
    return `${errorMessage} Log ID: ${error.logId}`;
};

export const profileDisplayNameForDeletedUser = (role: UserRole | null): string =>
    `Deleted User ${role && `- ${capitaliseWords(role)}`}`;
