import * as dotenv from "dotenv";
import { getLocalSupabaseClient } from "./getLocalSupabaseClient";
import * as fs from "fs";
import { SupabaseClient } from "@supabase/supabase-js";

dotenv.config({ path: "./.env.local" });

createStorage();

async function createStorage(): Promise<void> {
    const supabase = getLocalSupabaseClient();

    const bucketName = "congestion-charge";

    await createPublicBucket(supabase, bucketName);

    await uploadCongestionZoneFile(supabase, bucketName);
}

async function createPublicBucket(supabase: SupabaseClient, name: string): Promise<void> {
    const { error } = await supabase.storage.createBucket(name, {
        public: true,
    });

    if (error) {
        throw new Error(`Failed to create bucket called ${name}, error: ${error.message}`);
    }
}

async function uploadCongestionZoneFile(
    supabase: SupabaseClient,
    bucketName: string
): Promise<void> {
    const file = fs.readFileSync("supabase/tools/congestion-zone-postcodes.txt");

    const { error } = await supabase.storage
        .from(bucketName)
        .upload("congestion-zone-postcodes.txt", file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to upload congestion charge file, error: ${error.message}`);
    }
}
