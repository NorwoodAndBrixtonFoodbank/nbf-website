import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getLocalSupabaseClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error("Supabase URL is not specified");
    }

    if (!supabaseUrl.includes("localhost") && !supabaseUrl.includes("127.0.0.1")) {
        throw new Error("Supabase URL needs to be a localhost port");
    }

    if (!supabaseKey) {
        throw new Error("Supabase key is not set");
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
