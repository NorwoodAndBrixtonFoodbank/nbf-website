import { createClient } from "@supabase/supabase-js";
import { GoTrueAdminApi } from "@supabase/gotrue-js";

export function getSupabaseAdminAuthClient(): GoTrueAdminApi {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error("Supabase URL is not specified");
    }

    if (!supabaseKey) {
        throw new Error("Supabase key is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return supabase.auth.admin;
}
