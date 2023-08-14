import supabase, { InsertSchema, Schema } from "@/supabase";

type ParcelDatabaseInsertRecord = InsertSchema["parcels"];
type ParcelsDatabaseFetchRecord = Pick<Schema["parcels"], "primary_key" | "client_id">;

export const insertParcel = async (
    parcelRecord: ParcelDatabaseInsertRecord
): Promise<ParcelsDatabaseFetchRecord> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase.from("parcels").insert(parcelRecord).select("primary_key, client_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw new Error(
        `Error occurred whilst inserting into Parcels table. HTTP Code: ${status}, PostgreSQL Code: ${error?.code}. `
    );
};
