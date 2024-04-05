"use server";

import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { logErrorReturnLogId } from "@/logger/logger";
import { User } from "@supabase/gotrue-js";

export async function getCurrentUser(): Promise<User | null> {
    const serverComponentClient = getSupabaseServerComponentClient();

    const { data, error } = await serverComponentClient.auth.getUser();

    if (error) {
        void logErrorReturnLogId("error with auth getUser", error);
    }

    return data.user;
}
