import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

export type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
export type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

export type InsertParcelErrors = "failedToInsertParcel";
export type InsertParcelReturnType = {
    error: { type: InsertParcelErrors; logId: string } | null;
    parcelId: string | undefined;
};

export const insertParcel = async (
    parcelRecord: ParcelDatabaseInsertRecord
): Promise<InsertParcelReturnType> => {
    const { data, error } = await supabase
        .from("parcels")
        .insert(parcelRecord)
        .select("primary_key")
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
        return { error: { type: "failedToInsertParcel", logId }, parcelId: undefined };
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true, parcelId: data.primary_key });
    return { error: null, parcelId: data.primary_key };
};

export type UpdateParcelErrors = "failedToUpdateParcel" | "concurrentUpdateConflict";
export type UpdateParcelReturnType = {
    error: { type: UpdateParcelErrors; logId: string } | null;
    parcelId: string | undefined;
};

export const updateParcel = async (
    parcelRecord: ParcelDatabaseUpdateRecord,
    primaryKey: string
): Promise<UpdateParcelReturnType> => {
    const { error, count } = await supabase
        .from("parcels")
        .update(parcelRecord, { count: "exact" })
        .eq("primary_key", primaryKey)
        .eq("last_updated", parcelRecord.last_updated);

    const auditLog = {
        action: "edit a parcel",
        content: { parcelDetails: parcelRecord, count: count },
        clientId: parcelRecord.client_id,
        collectionCentreId: parcelRecord.collection_centre
            ? parcelRecord.collection_centre
            : undefined,
        packingSlotId: parcelRecord.packing_slot ? parcelRecord.packing_slot : undefined,
        parcelId: primaryKey,
    } as const satisfies Partial<AuditLog>;

    if (error) {
        const logId = await logErrorReturnLogId("Error with update: parcel data", error);
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { error: { type: "failedToUpdateParcel", logId }, parcelId: undefined };
    }

    if (count === 0) {
        const logId = await logWarningReturnLogId("Concurrent editing of parcel");
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { error: { type: "concurrentUpdateConflict", logId }, parcelId: undefined };
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true });
    return { error: null, parcelId: primaryKey };
};
