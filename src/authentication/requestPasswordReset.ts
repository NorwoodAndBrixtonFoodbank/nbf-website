import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logErrorReturnLogId } from "@/logger/logger";
import { AuthError } from "@supabase/gotrue-js";
import { helpEmailAddress } from "@/common/contactDetails";
import { HttpStatusCode } from "axios";

interface RequestPasswordResetResponse {
    errorMessage: string | null;
}

function formatErrorMessage(error: AuthError): string {
    if (error.status === HttpStatusCode.TooManyRequests) {
        return error.message + `.\nPlease contact admin for help.\n${helpEmailAddress}`;
    }
    return error.message;
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
