"use server";

import { User } from "@supabase/gotrue-js";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { errorsOnAuthentication } from "@/server/authenticateAdminUser";

type GetUsersType =
    | {
          data: User[];
          error: null;
      }
    | {
          data: null;
          error: Record<string, any>;
      };

export async function adminGetUsers(): Promise<GetUsersType> {
    const { error: authenticationError } = await errorsOnAuthentication();

    if (authenticationError) {
        return {
            data: null,
            error: { AuthError: authenticationError },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.listUsers();

    if (error) {
        return {
            data: null,
            error: { AuthError: "error fetching list of users" },
        };
    }

    return {
        data: data.users,
        error: null,
    };
}
