import { Json } from "@/databaseTypesFile";
import { ViewSchema } from "@/databaseUtils";

export type AuditLogResponseData = ViewSchema["audit_log_plus"][];

export interface AuditLogRow {
    auditLogId: string;
    action: string;
    actorName: string;
    clientId: string;
    collectionCentreId: string;
    content: Json;
    createdAt: string;
    eventId: string;
    listHotelId: string;
    listId: string;
    logId: string;
    packingSlotId: string;
    parcelId: string;
    profileId: string;
    statusOrder: string;
    wasSuccess: boolean | null;
    websiteData: string;
}

export const convertAuditLogResponseToAuditLogRow = (
    auditLogResponse: AuditLogResponseData
): AuditLogRow[] =>
    auditLogResponse.map((auditLogResponseRow) => ({
        auditLogId: auditLogResponseRow.primary_key ?? "",
        action: auditLogResponseRow.action ?? "",
        actorName:
            auditLogResponseRow.actor_user_id === null
                ? "User Deleted"
                : auditLogResponseRow.actor_name ?? "",
        clientId: auditLogResponseRow.client_id ?? "",
        collectionCentreId: auditLogResponseRow.collection_centre_id ?? "",
        content: auditLogResponseRow.content ?? "",
        createdAt: auditLogResponseRow.created_at ?? "",
        eventId: auditLogResponseRow.event_id ?? "",
        listHotelId: auditLogResponseRow.list_hotel_id ?? "",
        listId: auditLogResponseRow.list_id ?? "",
        logId: auditLogResponseRow.log_id ?? "",
        packingSlotId: auditLogResponseRow.packing_slot_id ?? "",
        parcelId: auditLogResponseRow.parcel_id ?? "",
        profileId: auditLogResponseRow.profile_id ?? "",
        statusOrder: auditLogResponseRow.status_order ?? "",
        wasSuccess: auditLogResponseRow.wasSuccess ?? null,
        websiteData: auditLogResponseRow.website_data ?? "",
    }));
