import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logError } from "@/logger/logger";

interface UpdatePasswordResponse {
    errorMessage?: string;
}

export async function updatePassword(
    newPassword: string,
): Promise<UpdatePasswordResponse> {
    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        void logError("Failed to update password ", { error });
        return { errorMessage: error.message };
    }

    return {};
}
