import { logErrorReturnLogId } from "@/logger/logger";
import { Supabase } from "@/supabaseUtils";
import { AuditLogRow } from "./AuditLogTable";
import { SortState } from "@/components/Tables/Table";
import { PaginationType } from "@/components/Tables/Filters";

type AuditLogResponse =
    | {
          data: AuditLogRow[];
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
    let query = supabase.from("audit_log").select("*").range(startIndex, endIndex);

    if (
        sortState.sortEnabled &&
        sortState.column.sortMethodConfig?.paginationType === PaginationType.Server
    ) {
        query = sortState.column.sortMethodConfig.method(query, sortState.sortDirection);
    } else {
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        const logId = await logErrorReturnLogId("Error with fetch: Audit Log", {
            error: error,
        });
        return { data: null, error: { type: "failedAuditLogFetch", logId: logId } };
    }

    const convertedData: AuditLogRow[] = data.map((datum) => ({
        action: datum.action ?? "",
        clientId: datum.client_id ?? "",
        collectionCentreId: datum.collection_centre_id ?? "",
        content: datum.content ?? "",
        createdAt: datum.created_at ?? "",
        eventId: datum.event_id ?? "",
        listHotelId: datum.list_hotel_id ?? "",
        listId: datum.list_id ?? "",
        logId: datum.log_id ?? "",
        packingSlotId: datum.packing_slot_id ?? "",
        parcelId: datum.parcel_id ?? "",
        profileId: datum.profile_id ?? "",
        statusOrder: datum.status_order ?? "",
        userId: datum.user_id ?? "",
        wasSuccess: datum.wasSuccess ?? "",
        websiteData: datum.website_data ?? "",
    }));

    return { data: convertedData, error: null };
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
