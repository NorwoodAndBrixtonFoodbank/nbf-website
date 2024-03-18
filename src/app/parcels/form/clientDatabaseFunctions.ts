import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

export const insertParcel = async (parcelRecord: ParcelDatabaseInsertRecord): Promise<void> => {
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
