import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logErrorReturnLogId } from "@/logger/logger";

interface RequestPasswordResetResponse {
    errorMessage: string | null;
}

export async function requestPasswordReset({
    email,
    redirectUrl,
}: {
    email: string;
    redirectUrl: string;
}): Promise<RequestPasswordResetResponse> {
    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });

    if (error) {
        void logErrorReturnLogId("Password reset request failed", { error });
        return { errorMessage: error.message };
    }

    return { errorMessage: null };
}
