import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuditLogProps, sendAuditLog } from "@/server/auditLog";

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

export const insertParcel = async (parcelRecord: ParcelDatabaseInsertRecord): Promise<void> => {
    const { data, error } = await supabase
        .from("parcels")
        .insert(parcelRecord)
        .select("primary_key, client_id")
        .single();

    let logId: string;

    const auditLog: AuditLogProps = {
        action: "add a parcel",
        content: { parcel: parcelRecord },
        wasSuccess: false,
        clientId: parcelRecord.client_id,
        collectionCentreId: parcelRecord.collection_centre
            ? parcelRecord.collection_centre
            : undefined,
        packingSlotId: parcelRecord.packing_slot ? parcelRecord.packing_slot : undefined,
    };

    if (error) {
        logId = await logErrorReturnLogId("Error with insert: parcel data", error);
        auditLog.logId = logId;
        await sendAuditLog(auditLog);
        throw new DatabaseError("insert", "parcel data", logId);
    }

    auditLog.parcelId = data.primary_key;
    auditLog.wasSuccess = true;
    await sendAuditLog(auditLog);
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
