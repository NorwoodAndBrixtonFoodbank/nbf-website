import { Json } from "@/databaseTypesFile";
import { AuditLogPlusDbRow } from "@/databaseUtils";
import { profileDisplayNameForDeletedUser } from "./format";

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

export const convertAuditLogPlusRowsToAuditLogRows = (
    auditLogResponse: AuditLogPlusDbRow[]
): AuditLogRow[] =>
    auditLogResponse.map((auditLogPlusRow) => ({
        auditLogId: auditLogPlusRow.primary_key ?? "",
        action: auditLogPlusRow.action ?? "",
        actorName:
            auditLogPlusRow.actor_user_id === null
                ? profileDisplayNameForDeletedUser(auditLogPlusRow.actor_role)
                : auditLogPlusRow.actor_name ?? "",
        clientId: auditLogPlusRow.client_id ?? "",
        collectionCentreId: auditLogPlusRow.collection_centre_id ?? "",
        content: auditLogPlusRow.content ?? "",
        createdAt: auditLogPlusRow.created_at ?? "",
        eventId: auditLogPlusRow.event_id ?? "",
        listHotelId: auditLogPlusRow.list_hotel_id ?? "",
        listId: auditLogPlusRow.list_id ?? "",
        logId: auditLogPlusRow.log_id ?? "",
        packingSlotId: auditLogPlusRow.packing_slot_id ?? "",
        parcelId: auditLogPlusRow.parcel_id ?? "",
        profileId: auditLogPlusRow.profile_id ?? "",
        statusOrder: auditLogPlusRow.status_order ?? "",
        wasSuccess: auditLogPlusRow.wasSuccess ?? null,
        websiteData: auditLogPlusRow.website_data ?? "",
    }));
