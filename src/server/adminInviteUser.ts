"use server";

import { authenticateAsAdmin } from "@/server/authenticateAdminUser";
import { getSupabaseAdminAuthClient } from "@/supabaseAdminAuthClient";
import { User } from "@supabase/gotrue-js";
import { InviteUserDetails } from "@/app/admin/createUser/CreateUserForm";
import supabase from "@/supabaseClient";
import { logErrorReturnLogId, logInfoReturnLogId } from "@/logger/logger";

export type InviteUserErrorType =
    | "adminAuthenticationFailure"
    | "inviteUserFailure"
    | "createProfileFailure";

export interface InviteUserError {
    type: InviteUserErrorType;
    logId: string;
}

type InviteUsersDataAndErrorType =
    | {
          data: User;
          error: null;
      }
    | {
          data: null;
          error: InviteUserError;
      };

export async function adminInviteUser(
    userDetails: InviteUserDetails,
    redirectUrl: string
): Promise<InviteUsersDataAndErrorType> {
    const { isSuccess, failureReason } = await authenticateAsAdmin();

    if (!isSuccess) {
        const logId = await logErrorReturnLogId(
            "Error with authenticating admin", {error: failureReason}
        );
        return {
            data: null,
            error: { type: "adminAuthenticationFailure", logId: logId },
        };
    }

    const adminAuthClient = getSupabaseAdminAuthClient();
    const { data, error } = await adminAuthClient.inviteUserByEmail(userDetails.email, {
        redirectTo: redirectUrl,
    });

    if (error) {
        const logId = await logErrorReturnLogId("Error with inviting user", {error: error});
        return {
            data: null,
            error: { type: "inviteUserFailure", logId: logId },
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
        const logId = await logErrorReturnLogId("Error with insert profile", {error: createRoleError});
        return {
            data: null,
            error: { type: "createProfileFailure", logId: logId },
        };
    }
    void logInfoReturnLogId(`Created a profile for ${userDetails.role} user: ${userDetails.email}`);

    return {
        data: data.user,
        error: null,
    };
}
