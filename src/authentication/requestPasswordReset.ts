import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logError } from "@/logger/logger";

interface RequestPasswordResetResponse {
    errorMessage?: string;
}

export async function requestPasswordReset(
    email: string,
    redirectTo: string
): Promise<RequestPasswordResetResponse> {
    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
        void logError("Password reset request failed", { error });
        return { errorMessage: error.message };
    }

    return {};
}
