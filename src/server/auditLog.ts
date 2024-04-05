import { getCurrentUser } from "@/server/getCurrentUser";
import supabase from "@/supabaseClient";
import { InsertSchema } from "@/databaseUtils";
import { PostgrestError } from "@supabase/supabase-js";

type AuditLogInsertRecord = InsertSchema["audit_log"];

export async function sendAuditLog(
    action: string,
    content: Record<string, string>,
    wasSuccess: boolean,
    logId: string,
    clientId?: string,
    collectionCentreId?: string,
    eventId?: string,
    familyMemberId?: string,
    listId?: string,
    listHotelId?: string,
    packingSlotId?: string,
    parcelId?: string
): Promise<PostgrestError | null> {
    const currentUser = await getCurrentUser();

    if (currentUser === null) {
        return null;
    }
    const auditLog: AuditLogInsertRecord = {
        user_id: currentUser.id,
        action: action,
        client_id: clientId,
        collection_centre_id: collectionCentreId,
        event_id: eventId,
        family_member_id: familyMemberId,
        list_id: listId,
        list_hotel_id: listHotelId,
        packing_slot_id: packingSlotId,
        parcel_id: parcelId,
        content: content,
        wasSuccess: wasSuccess,
        log_id: logId,
    };

    const { error } = await supabase
        .from("audit_log")
        .insert(auditLog)
        .select("primary_key, client_id");
    return error;
}
