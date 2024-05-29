import supabase from "@/supabaseClient";
import { InsertSchema, UpdateSchema } from "@/databaseUtils";
import { logErrorReturnLogId, logWarningReturnLogId } from "@/logger/logger";
import { AuditLog, sendAuditLog } from "@/server/auditLog";

export type WriteParcelToDatabaseFunction = UpdateParcel | InsertParcel;
export type WriteParcelToDatabaseErrors = InsertParcelErrorType | UpdateParcelErrorType;

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelDatabaseUpdateRecord = UpdateSchema["parcels"];

type InsertParcelErrorType = "failedToInsertParcel";
type InsertParcelReturnType = {
    error: { type: InsertParcelErrorType; logId: string } | null;
    parcelId: string | null;
};

type InsertParcel = (parcelRecord: ParcelDatabaseInsertRecord) => Promise<InsertParcelReturnType>;

export const insertParcel: InsertParcel = async (parcelRecord) => {
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
        return { parcelId: null, error: { type: "failedToInsertParcel", logId } };
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true, parcelId: data.primary_key });
    return { parcelId: data.primary_key, error: null };
};

type UpdateParcelErrorType = "failedToUpdateParcel" | "concurrentUpdateConflict";
export type UpdateParcelError = { type: UpdateParcelErrorType; logId: string };
type UpdateParcelReturnType = {
    error: UpdateParcelError | null;
    parcelId: string | null;
};

type UpdateParcelWithPrimaryKey = (primaryKey: string) => UpdateParcel;
type UpdateParcel = (parcelRecord: ParcelDatabaseUpdateRecord) => Promise<UpdateParcelReturnType>;

export const updateParcel: UpdateParcelWithPrimaryKey = (primaryKey) => async (parcelRecord) => {
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
        return { parcelId: null, error: { type: "failedToUpdateParcel", logId } };
    }

    if (count === 0) {
        const logId = await logWarningReturnLogId("Concurrent editing of parcel");
        await sendAuditLog({ ...auditLog, wasSuccess: false, logId });
        return { parcelId: null, error: { type: "concurrentUpdateConflict", logId } };
    }

    await sendAuditLog({ ...auditLog, wasSuccess: true });
    return { parcelId: primaryKey, error: null };
};
