"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { InviteUserDetails } from "@/app/admin/createUser/CreateUserForm";
import supabase from "@/supabaseClient";
import { logInfoReturnLogId } from "@/logger/logger";

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

    if (data) {
        const { error: createRoleError } = await supabase.from("profiles").insert({
            primary_key: data.user.id,
            role: userDetails.role,
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
            telephone_number: userDetails.telephoneNumber,
        });
        if (createRoleError) {
            return {
                data: null,
                error: { "Failed to create user profile": createRoleError.message },
            };
        }
        void logInfoReturnLogId(
            `Created a profile for ${userDetails.role} user: ${userDetails.email}`
        );
    }

    return {
        data: data.user,
        error: null,
    };
}