import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { getCurrentUser } from "@/server/getCurrentUser";

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

interface auditLog {
    user_id: string;
    action: string;
    foreign_keys: foreignKeys;
    content: {};
    wasSuccess: boolean;
    log_id: string;
}

interface foreignKeys {
    client_id?: string;
    collection_centre_id?: string;
    event_id?: string;
    family_member_id?: string;
    list_id?: string;
    list_hotel_id?: string;
    packing_slot_id?: string;
    parcel_id?: string;
    status_order_id?: string;
    website_data_id?: string;
}
export const insertParcel = async (parcelRecord: ParcelDatabaseInsertRecord): Promise<void> => {
    const currentUser = getCurrentUser();
    const { error } = await supabase
        .from("parcels")
        .insert(parcelRecord)
        .select("primary_key, client_id");

    if (error) {
        const logId = await logErrorReturnLogId("Error with insert: parcel data", error);
        throw new DatabaseError("insert", "parcel data", logId);
    }
};

export const updateParcel = async (
    parcelRecord: ParcelDatabaseUpdateRecord,
    primaryKey: string
): Promise<void> => {
    const { error } = await supabase
        .from("parcels")
        .update(parcelRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, client_id");

    if (error) {
        const logId = await logErrorReturnLogId("Error with update: parcel data", error);
        throw new DatabaseError("update", "parcel data", logId);
    }
};
