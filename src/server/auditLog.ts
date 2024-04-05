import { getCurrentUser } from "@/server/getCurrentUser";
import supabase from "@/supabaseClient";
import { InsertSchema } from "@/databaseUtils";
import { PostgrestError } from "@supabase/supabase-js";
import { logErrorReturnLogId } from "@/logger/logger";
import { DatabaseError } from "@/app/errorClasses";

type AuditLogInsertRecord = InsertSchema["audit_log"];
export interface AuditLogProps {
    action?: string;
    content: Record<string, any>;
    wasSuccess: boolean;
    logId?: string;
    clientId?: string;
    collectionCentreId?: string;
    eventId?: string;
    familyMemberId?: string;
    listId?: string;
    listHotelId?: string;
    packingSlotId?: string;
    parcelId?: string;
}

export async function sendAuditLog(auditLogProps: AuditLogProps): Promise<void> {
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
        family_member_id: auditLogProps.familyMemberId,
        list_id: auditLogProps.listId,
        list_hotel_id: auditLogProps.listHotelId,
        packing_slot_id: auditLogProps.packingSlotId,
        parcel_id: auditLogProps.parcelId,
        content: auditLogProps.content,
        wasSuccess: auditLogProps.wasSuccess,
        log_id: auditLogProps.logId,
    };

    const { error } = await supabase
        .from("audit_log")
        .insert(auditLog)
        .select("primary_key, client_id");

    if (error) {
        const logId = await logErrorReturnLogId("failed to add audit log", error);
        throw new DatabaseError("insert", "audit log", logId);
    }
}
