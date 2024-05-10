import { logErrorReturnLogId } from "@/logger/logger";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { updateUserLastLogin } from "@/app/admin/manageUser/UpdateUserProfile";

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
    console.log((await supabase.auth.getUser()).data);
}

export async function signInWithTokens(accessToken: string, refreshToken: string): Promise<void> {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error) {
        void logErrorReturnLogId("Sign in with tokens failed", { error });
        throw error;
    }
}
