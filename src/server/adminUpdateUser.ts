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
          error: Record<string, string>;
      };

interface UpdateUserEmailAndPassword {
    userId: string;
    attributes: AdminUserAttributes;
}

export async function adminUpdateUserEmailAndPassword(
    userDetails: UpdateUserEmailAndPassword
): Promise<UpdateUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            data: null,
            error: { "Failed to authenticate as admin": failureReason },
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
            error: { "Failed to update user": error.message },
        };
    }

    return {
        data: data.user,
        error: null,
    };
}
