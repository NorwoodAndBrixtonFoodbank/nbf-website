import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuthError } from "@supabase/gotrue-js";

interface RequestPasswordResetResponse {
    errorMessage: string | null;
}

function formatErrorMessage(error: AuthError): string {
    let errorMessage = error.message;
    // HTTP 429 is "too many requests". Usually means email rate limit has been exceeded.
    if (error.status === 429) {
        errorMessage += ".\nPlease contact admin for help.\nhelp@foodbankapp.org";
    }
    return errorMessage;
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
        return { errorMessage: formatErrorMessage(error) };
    }

    return { errorMessage: null };
}
