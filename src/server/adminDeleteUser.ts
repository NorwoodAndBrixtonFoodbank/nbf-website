"use server";

import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { logInfoReturnLogId } from "@/logger/logger";

export type DeleteUserErrorType = {
    error: Record<string, string> | null;
};

export async function adminDeleteUser(userId: string): Promise<DeleteUserErrorType> {
    const { isSuccess, reason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            error: { "Failed to authenticate as admin": reason },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { error } = await adminAuthClient.deleteUser(userId);

    if (error) {
        return {
            error: { AuthError: `error deleting user: ${userId}` },
        };
    }

    void logInfoReturnLogId(`Delete successful: user ${userId}`);

    return {
        error: null,
    };
}
