import supabase from "@/supabaseClient";
import { InsertSchema, Schema } from "@/database_utils";
import { RequestErrorMessage } from "@/app/errorStylingandMessages";

type InsertedParcels = InsertSchema["parcels"];
type FetchedParcels = Pick<Schema["parcels"], "primary_key" | "client_id">;

export const insertParcel = async (parcelRecord: InsertedParcels): Promise<FetchedParcels> => {
    const {
        data: ids,
        status,
        error,
    } = await supabase.from("parcels").insert(parcelRecord).select("primary_key, client_id");

    if (error === null && Math.floor(status / 100) === 2) {
        return ids![0];
    }
    throw new Error(RequestErrorMessage);
};
