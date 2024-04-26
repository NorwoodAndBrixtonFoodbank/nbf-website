import { Json } from "@/databaseTypesFile";
import { Schema } from "@/databaseUtils";

export interface AuditLogRow {
    auditLogId: string;
    action: string;
    actorProfileId: string;
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
    wasSuccess: boolean;
    websiteData: string;
}

export const convertAuditLogResponseToAuditLogRow = (
    auditLogResponse: Schema["audit_log"][]
): AuditLogRow[] =>
    auditLogResponse.map((auditLogResponseRow) => ({
        auditLogId: auditLogResponseRow.primary_key,
        action: auditLogResponseRow.action ?? "",
        actorProfileId: auditLogResponseRow.actor_profile_id ?? "",
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
        wasSuccess: auditLogResponseRow.wasSuccess ?? "",
        websiteData: auditLogResponseRow.website_data ?? "",
    }));
