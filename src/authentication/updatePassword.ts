import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { logErrorReturnLogId } from "@/logger/logger";

interface UpdatePasswordResponse {
    errorMessage: string | null;
}

export async function updatePassword(newPassword: string): Promise<UpdatePasswordResponse> {
    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        void logErrorReturnLogId("Failed to update password ", { error });
        return { errorMessage: error.message };
    }

    return { errorMessage: null };
}
