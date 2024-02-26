import * as dotenv from "dotenv";
import { getSupabaseClient } from "./getSupabaseClient";
import * as fs from "fs";

dotenv.config({ path: "./.env.local" });

createStorage();

async function createStorage(): Promise<void> {
    const supabase = getSupabaseClient();

    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket("public", {
        public: true,
    });

    const file = fs.readFileSync("supabase/tools/congestion-zone-postcodes.txt");

    const { data, error } = await supabase.storage
        .from("public")
        .upload("congestion-zone-postcodes.txt", file, {
            cacheControl: "3600",
            upsert: false,
        });
}
