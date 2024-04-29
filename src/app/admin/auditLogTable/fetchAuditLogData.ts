import { logErrorReturnLogId } from "@/logger/logger";
import { Supabase } from "@/supabaseUtils";
import { AuditLogResponseData, AuditLogRow } from "./types";
import { SortState } from "@/components/Tables/Table";
import { PaginationType } from "@/components/Tables/Filters";

type AuditLogResponse =
    | {
          data: AuditLogResponseData;
          error: null;
      }
    | {
          data: null;
          error: AuditLogError;
      };

type AuditLogCountResponse =
    | {
          count: number;
          error: null;
      }
    | {
          count: null;
          error: AuditLogCountError;
      };

export interface AuditLogError {
    type: "failedAuditLogFetch";
    logId: string;
}
export interface AuditLogCountError {
    type: "failedAuditLogCountFetch" | "nullCount";
    logId: string;
}

export const fetchAuditLog = async (
    supabase: Supabase,
    startIndex: number,
    endIndex: number,
    sortState: SortState<AuditLogRow>
): Promise<AuditLogResponse> => {
    let query = supabase
        .from("audit_log")
        .select("*, profiles!actor_profile_id(first_name, last_name, user_id)")
        .range(startIndex, endIndex)
        .limit(1, { foreignTable: "profiles" });

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("created_at", { ascending: false });
    }

    const { data: auditLogs, error } = await query;

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Audit Log", {
            error: error,
        });
        return { data: null, error: { type: "failedAuditLogFetch", logId: logId } };
    }

    return { data: auditLogs, error: null };
};

export const fetchAuditLogCount = async (supabase: Supabase): Promise<AuditLogCountResponse> => {
    const { count, error } = await supabase
        .from("audit_log")
        .select("*", { count: "exact", head: true });

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Audit Log Count", {
            error: error,
        });
        return { count: null, error: { type: "failedAuditLogCountFetch", logId: logId } };
    }

    if (count === null) {
        const logId = await logErrorReturnLogId("Error with fetch: Audit Log Count", {
            error: "nullCount",
        });
        return { count: null, error: { type: "nullCount", logId: logId } };
    }

    return { count: count, error: null };
};
