"use server";

import { getCurrentUser } from "@/server/getCurrentUser";
import { InsertSchema } from "@/databaseUtils";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";
import { Json } from "@/databaseTypesFile";
import { getSupabaseServerComponentClient } from "@/supabaseServer";

type AuditLogInsertRecord = InsertSchema["audit_log"];
export interface AuditLog {
    action?: string;
    content: Json | null;
    wasSuccess: boolean;
    logId?: string;
    clientId?: string;
    collectionCentreId?: string;
    eventId?: string;
    listId?: string;
    listHotelId?: string;
    packingSlotId?: string;
    parcelId?: string;
    profileId?: string;
}

export async function sendAuditLog(auditLogProps: AuditLog): Promise<void> {
    const currentUser = await getCurrentUser();

    if (currentUser === null) {
        const logId = await logErrorReturnLogId("failed to fetch current user for audit log");
        throw new DatabaseError("fetch", "current user for audit log", logId);
    }

    const auditLog: AuditLogInsertRecord = {
        user_id: currentUser.id,
        action: auditLogProps.action,
        client_id: auditLogProps.clientId,
        collection_centre_id: auditLogProps.collectionCentreId,
        event_id: auditLogProps.eventId,
        list_id: auditLogProps.listId,
        list_hotel_id: auditLogProps.listHotelId,
        packing_slot_id: auditLogProps.packingSlotId,
        parcel_id: auditLogProps.parcelId,
        profile_id: auditLogProps.profileId,
        content: auditLogProps.content,
        wasSuccess: auditLogProps.wasSuccess,
        log_id: auditLogProps.logId,
    };

    const supabase = getSupabaseServerComponentClient();

    const { error } = await supabase
        .from("audit_log")
        .insert(auditLog)
        .select("primary_key, client_id");

    if (error) {
        const logId = await logErrorReturnLogId("failed to add audit log", error);
        throw new DatabaseError("insert", "audit log", logId);
    }
}
