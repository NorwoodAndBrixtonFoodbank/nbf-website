import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { DatabaseError } from "@/app/errorClasses";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

export const insertParcel = async (parcelRecord: ParcelDatabaseInsertRecord): Promise<void> => {
    const { data, error } = await supabase
        .from("parcels")
        .insert(parcelRecord)
        .select("primary_key, client_id")
        .single();

    const auditLog = {
        action: "add a parcel",
        content: { parcelDetails: parcelRecord },
        clientId: parcelRecord.client_id,
        collectionCentreId: parcelRecord.collection_centre
            ? parcelRecord.collection_centre
            : undefined,
        packingSlotId: parcelRecord.packing_slot ? parcelRecord.packing_slot : undefined,
    } as const satisfies Partial<AuditLog>;

    if (error) {
        const logId = await logErrorReturnLogId("Error with insert: parcel data", error);
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        throw new DatabaseError("insert", "parcel data", logId);
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true, parcelId: data.primary_key });
};

export const updateParcel = async (
    parcelRecord: ParcelDatabaseUpdateRecord,
    primaryKey: string
): Promise<void> => {
    const { data, error } = await supabase
        .from("parcels")
        .update(parcelRecord)
        .eq("primary_key", primaryKey)
        .select("primary_key, client_id")
        .single();

    const auditLog = {
        action: "edit a parcel",
        content: { parcelDetails: parcelRecord },
        clientId: parcelRecord.client_id,
        collectionCentreId: parcelRecord.collection_centre
            ? parcelRecord.collection_centre
            : undefined,
        packingSlotId: parcelRecord.packing_slot ? parcelRecord.packing_slot : undefined,
    } as const satisfies Partial<AuditLog>;

    if (error) {
        const logId = await logErrorReturnLogId("Error with update: parcel data", error);
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        throw new DatabaseError("update", "parcel data", logId);
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true, parcelId: data.primary_key });
};
