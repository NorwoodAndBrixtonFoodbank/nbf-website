import { getSupabaseServerComponentClient } from "@/supabaseServer";
import { logErrorReturnLogId } from "@/logger/logger";
import { User } from "@supabase/gotrue-js";

export async function getCurrentUser(): Promise<User | null> {
    const serverComponentClient = getSupabaseServerComponentClient();

    const { data, error } = await serverComponentClient.auth.getUser();

    if (error) {
        const logId = await logErrorReturnLogId("error with auth getUser", error);
        throw new Error(`Error getting current user. Log ID: ${logId}`);
    }

    return data.user;
}
