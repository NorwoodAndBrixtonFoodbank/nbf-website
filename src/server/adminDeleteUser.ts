"use server";

import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { errorsOnAuthentication } from "@/server/authenticateAdminUser";

export type DeleteUserErrorType = {
    error: Record<string, any> | null;
};

export async function adminDeleteUser(userId: string): Promise<DeleteUserErrorType> {
    const { error: authenticationError } = await errorsOnAuthentication();

    if (authenticationError) {
        return {
            error: { AuthError: authenticationError },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { error } = await adminAuthClient.deleteUser(userId);

    if (error) {
        return {
            error: { AuthError: `error deleting user: ${userId}` },
        };
    }

    return {
        error: null,
    };
}
