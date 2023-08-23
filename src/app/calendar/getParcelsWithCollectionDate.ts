import supabase from "@/supabaseServer";
import { Schema } from "@/database_utils";

export type ParcelWithClientName = Schema["parcels"] & { clients: { full_name: string } | null };

const getParcelsWithCollectionDate = async (): Promise<ParcelWithClientName[]> => {
    const { data, error } = await supabase
        .from("parcels")
        .select("*, clients ( full_name )")
        .not("collection_datetime", "is", null);

    if (error) {
        console.error("\n\n\n");
        console.error(error);
        console.error("\n\n\n");
        throw new Error("Database error");
    }

    return data;
};

export default getParcelsWithCollectionDate;
