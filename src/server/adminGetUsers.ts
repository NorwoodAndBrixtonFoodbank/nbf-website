"use server";

import { User } from "@supabase/gotrue-js";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { authenticateAsAdmin } from "@/server/authenticateAdminUser";

type GetUsersDataAndErrorType =
    | {
          data: User[];
          error: null;
      }
    | {
          data: null;
          error: Record<string, string>;
      };

export async function adminGetUsers(): Promise<GetUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            data: null,
            error: { "Failed to authenticate as admin": failureReason },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.listUsers();

    if (error) {
        return {
            data: null,
            error: { "Failed to fetch list of users": error.message },
        };
    }

    return {
        data: data.users,
        error: null,
    };
}
