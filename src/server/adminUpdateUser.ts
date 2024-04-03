"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { AdminUserAttributes, User } from "@supabase/gotrue-js";

type UpdateUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: Record<string, any>;
      };

interface UpdateUserEmailAndPassword {
    userId: string;
    attributes: AdminUserAttributes;
}

export async function adminUpdateUserEmailAndPassword(
    userDetails: UpdateUserEmailAndPassword
): Promise<UpdateUsersDataAndErrorType> {
    const { isSuccess, reason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            data: null,
            error: { AuthError: reason },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();

    const { data, error } = await adminAuthClient.updateUserById(
        userDetails.userId,
        userDetails.attributes
    );

    if (error) {
        return {
            data: null,
            error: { AuthError: `error updating user ${userDetails.attributes.email}` },
        };
    }

    return {
        data: data.user,
        error: null,
    };
}
