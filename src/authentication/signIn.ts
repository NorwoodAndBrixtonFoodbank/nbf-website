import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function signInWithPassword(credentials: {
    email: string;
    password: string;
}): Promise<void> {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        void logErrorReturnLogId("Sign in with password failed", { error });
        throw error;
    }

    return;
}

export async function signInWithTokens(accessToken: string, refreshToken: string): Promise<void> {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.setSession({access_token: accessToken, refresh_token: refreshToken});
    logInfoReturnLogId(JSON.stringify(data));
    if (error) {
        void logErrorReturnLogId("Sign in with tokens failed", { error });
        throw error;
    }

    return;
}
