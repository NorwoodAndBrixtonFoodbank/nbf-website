"use server";

import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { logErrorReturnLogId } from "@/logger/logger";
import { User } from "@supabase/gotrue-js";

export async function getCurrentUser(): Promise<User | null> {
    const supabase = getSupabaseServerComponentClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        void logErrorReturnLogId("error with auth getUser", error);
    }

    return data.user;
}
