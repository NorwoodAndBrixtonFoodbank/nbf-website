"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { InviteUserDetails } from "@/app/admin/createUser/CreateUserForm";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

type InviteUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: Record<string, string>;
      };

export async function adminInviteUser(
    userDetails: InviteUserDetails,
    redirectUrl: string
): Promise<InviteUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        return {
            data: null,
            error: { "Failed to authenticate as admin": failureReason },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.inviteUserByEmail(userDetails.email, {
        redirectTo: redirectUrl,
    });

    if (error) {
        return {
            data: null,
            error: { "Failed to create user": error.message },
        };
    }

    const { error: createRoleError } = await supabase.from("profiles").insert({
        role: userDetails.role,
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        telephone_number: userDetails.telephoneNumber,
        user_id: data.user.id,
    });
    
    if (createRoleError) {
        return {
            data: null,
            error: { "Failed to create user profile": createRoleError.message },
        };
    }
    void logInfoReturnLogId(`Created a profile for ${userDetails.role} user: ${userDetails.email}`);

    return {
        data: data.user,
        error: null,
    };
}
